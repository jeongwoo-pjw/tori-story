import { useState, useEffect, useRef } from "react";

/* ── 공통 드로잉 훅 ────────────────────────────────────── */
function useDrawingCanvas(
  word: string,
  strokeColor: string,
  onFirstDraw?: () => void,
) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const clearRef = useRef<() => void>(() => {});
  const cbRef = useRef(onFirstDraw);
  useEffect(() => { cbRef.current = onFirstDraw; });

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let notified = false;

    const drawGuide = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 글자 수에 맞게 동적 크기 계산
      const byWidth = Math.floor((canvas.width * 0.72) / Math.max(word.length, 1));
      const byHeight = Math.floor(canvas.height * 0.72);
      ctx.font = `bold ${Math.min(byWidth, byHeight)}px sans-serif`;
      ctx.fillStyle = "rgba(139,92,246,0.18)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(word, canvas.width / 2, canvas.height / 2);
    };

    clearRef.current = () => { notified = false; drawGuide(); };
    drawGuide();

    const getPos = (e: MouseEvent | Touch) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * canvas.width,
        y: ((e.clientY - r.top) / r.height) * canvas.height,
      };
    };

    const start = (pos: { x: number; y: number }) => {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const move = (pos: { x: number; y: number }) => {
      if (!isDrawing) return;
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      if (!notified) { notified = true; cbRef.current?.(); }
    };
    const end = () => { isDrawing = false; };

    const onMD = (e: MouseEvent) => start(getPos(e));
    const onMM = (e: MouseEvent) => move(getPos(e));
    const onTS = (e: TouchEvent) => { e.preventDefault(); start(getPos(e.touches[0])); };
    const onTM = (e: TouchEvent) => { e.preventDefault(); move(getPos(e.touches[0])); };

    canvas.addEventListener("mousedown", onMD);
    canvas.addEventListener("mousemove", onMM);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchmove", onTM, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", onMD);
      canvas.removeEventListener("mousemove", onMM);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", end);
    };
  }, [word, strokeColor]);

  return { cvs, clearRef };
}

/* ── 공통 캐러셀 컴포넌트 ──────────────────────────────── */
function Carousel({
  count,
  current,
  onPrev,
  onNext,
  children,
}: {
  count: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="px-8">
      <div className="relative">
        {current > 0 && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 w-11 h-11 rounded-full bg-background-50 border border-background-200 shadow-md flex items-center justify-center text-foreground-600 hover:text-foreground-950 hover:bg-primary-50 cursor-pointer transition-all"
          >
            <i className="ri-arrow-left-s-line text-2xl leading-none"></i>
          </button>
        )}
        {current < count - 1 && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 w-11 h-11 rounded-full bg-background-50 border border-background-200 shadow-md flex items-center justify-center text-foreground-600 hover:text-foreground-950 hover:bg-primary-50 cursor-pointer transition-all"
          >
            <i className="ri-arrow-right-s-line text-2xl leading-none"></i>
          </button>
        )}
        {children}
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === current
                ? "w-6 h-3 bg-primary-500"
                : "w-3 h-3 bg-background-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 퍼즐 활동 ─────────────────────────────────────────── */
function shufflePuzzle(): number[] {
  const arr = [0, 1, 2, 3, 4, 5];
  let tries = 0;
  do {
    for (let i = 5; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    tries++;
  } while (arr.every((v, i) => v === i) && tries < 20);
  return arr;
}

export function SuinPuzzleActivity({
  thumbnailSrc,
  onReady,
}: {
  thumbnailSrc: string;
  onReady: () => void;
}) {
  const [order, setOrder] = useState<number[]>(shufflePuzzle);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  // touch drag
  const touchDragPos = useRef<{ startPos: number; startX: number; startY: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  useEffect(() => { onReadyRef.current = onReady; });

  const swap = (a: number, b: number) => {
    if (a === b) return;
    const next = [...order];
    [next[a], next[b]] = [next[b], next[a]];
    setOrder(next);
    if (next.every((v, i) => v === i)) {
      setSolved(true);
      onReadyRef.current();
    }
  };

  /* ── 마우스 드래그 ── */
  const onDragStart = (pos: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    setDragging(pos);
  };
  const onDragOver = (pos: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(pos);
  };
  const onDrop = (pos: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragging !== null) swap(dragging, pos);
    setDragging(null);
    setDragOver(null);
  };
  const onDragEnd = () => { setDragging(null); setDragOver(null); };

  /* ── 터치 드래그 ── */
  const getPosFromPoint = (x: number, y: number): number | null => {
    if (!gridRef.current) return null;
    const cells = gridRef.current.querySelectorAll<HTMLElement>("[data-pos]");
    for (const cell of cells) {
      const r = cell.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return parseInt(cell.dataset.pos!, 10);
      }
    }
    return null;
  };

  const onTouchStart = (pos: number) => (e: React.TouchEvent) => {
    touchDragPos.current = { startPos: pos, startX: e.touches[0].clientX, startY: e.touches[0].clientY };
    setDragging(pos);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchDragPos.current) return;
    const over = getPosFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    setDragOver(over);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchDragPos.current) {
      const over = getPosFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      if (over !== null) swap(touchDragPos.current.startPos, over);
    }
    touchDragPos.current = null;
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div>
      <p className="text-sm font-label text-foreground-600 mb-3 text-center">
        조각을 드래그해서 그림을 완성해봐요!
      </p>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 4,
          width: "100%",
          aspectRatio: "4/3",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {order.map((pieceIdx, pos) => {
          const col = pieceIdx % 3;
          const row = Math.floor(pieceIdx / 3);
          const isDragging = dragging === pos;
          const isOver = dragOver === pos && dragging !== pos;
          return (
            <div
              key={pos}
              data-pos={pos}
              draggable={!solved}
              onDragStart={onDragStart(pos)}
              onDragOver={onDragOver(pos)}
              onDrop={onDrop(pos)}
              onDragEnd={onDragEnd}
              onTouchStart={onTouchStart(pos)}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                backgroundImage: thumbnailSrc ? `url(${thumbnailSrc})` : undefined,
                backgroundSize: "300% 200%",
                backgroundPosition: `${col * 50}% ${row * 100}%`,
                backgroundColor: thumbnailSrc ? undefined : "#e9e4f5",
                outline: isOver ? "3px solid #8b5cf6" : "none",
                outlineOffset: -3,
                opacity: isDragging ? 0.45 : 1,
                cursor: solved ? "default" : "grab",
                transition: "opacity 0.15s, outline 0.1s",
                touchAction: "none",
              }}
            />
          );
        })}
      </div>
      {solved && (
        <div className="mt-4 text-center">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-label text-emerald-700 mt-1 font-semibold">완성했어요!</p>
        </div>
      )}
    </div>
  );
}

/* ── 감정탐색 활동 ─────────────────────────────────────── */
const SUIN_EMOTIONS = [
  { emoji: "😊", label: "기쁨" },
  { emoji: "😢", label: "슬픔" },
  { emoji: "😮", label: "놀람" },
  { emoji: "😰", label: "걱정" },
  { emoji: "😌", label: "평온" },
  { emoji: "🥰", label: "따뜻함" },
];

export function SuinEmotionActivity({
  selectedEmotions,
  onToggle,
}: {
  selectedEmotions: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SUIN_EMOTIONS.map(({ emoji, label }) => {
        const opt = `${emoji} ${label}`;
        const isSelected = selectedEmotions.includes(opt);
        return (
          <button
            key={label}
            type="button"
            onClick={() => onToggle(opt)}
            className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isSelected
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40"
                : "border-background-200 bg-background-100 hover:border-primary-300"
            }`}
          >
            <span className="text-5xl leading-none">{emoji}</span>
            <span
              className={`text-sm font-label font-semibold ${
                isSelected ? "text-primary-700" : "text-foreground-700"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── 창의력 활동 (캐러셀) ──────────────────────────────── */
const SUIN_CREATIVE = [
  { id: "딱지놀이", label: "딱지놀이", icon: "🎯", color: "#f97316" },
  { id: "팽이놀이", label: "팽이놀이", icon: "🌀", color: "#8b5cf6" },
  { id: "공기놀이", label: "공기놀이", icon: "⚪", color: "#0ea5e9" },
];

function DrawingCard({
  label,
  icon,
  color,
  onFirstDraw,
}: {
  label: string;
  icon: string;
  color: string;
  onFirstDraw: () => void;
}) {
  const { cvs, clearRef } = useDrawingCanvas(label, color, onFirstDraw);
  return (
    <div className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <span className="text-sm font-label font-semibold text-foreground-800">
          {icon} {label}
        </span>
        <button
          type="button"
          onClick={() => clearRef.current()}
          className="text-xs text-foreground-400 hover:text-foreground-600 cursor-pointer"
        >
          지우기
        </button>
      </div>
      <canvas
        ref={cvs}
        width={300}
        height={170}
        className="w-full block"
        style={{
          cursor: "crosshair",
          background: "#faf8ff",
          borderTop: "1px solid #e9e4f5",
        }}
      />
    </div>
  );
}

export function SuinCreativeActivity({ onReady }: { onReady: () => void }) {
  const [current, setCurrent] = useState(0);
  const [readied, setReadied] = useState(false);
  const onReadyRef = useRef(onReady);
  useEffect(() => { onReadyRef.current = onReady; });

  const handleFirstDraw = () => {
    if (!readied) { setReadied(true); onReadyRef.current(); }
  };

  return (
    <Carousel
      count={SUIN_CREATIVE.length}
      current={current}
      onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
      onNext={() => setCurrent((c) => Math.min(SUIN_CREATIVE.length - 1, c + 1))}
    >
      <div style={{ overflow: "hidden", borderRadius: 16 }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.3s ease",
          }}
        >
          {SUIN_CREATIVE.map((item) => (
            <div key={item.id} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <DrawingCard
                label={item.label}
                icon={item.icon}
                color={item.color}
                onFirstDraw={handleFirstDraw}
              />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  );
}

/* ── 어휘 활동 (캐러셀) ────────────────────────────────── */
const SUIN_VOCAB = [
  {
    word: "반짝",
    meaning: "빛이 잠깐씩 밝게 빛나는 모습이에요.",
    example: "별이 밤하늘에서 반짝반짝 빛나요.",
  },
  {
    word: "산책",
    meaning: "천천히 걸으면서 바람을 쐬는 거예요.",
    example: "아빠랑 함께 산책을 했어요.",
  },
  {
    word: "알록달록",
    meaning: "여러 가지 예쁜 색깔이 섞여 있는 모습이에요.",
    example: "알록달록 연이 하늘을 날아요.",
  },
];

function VocabDrawingCard({
  word,
  meaning,
  example,
}: {
  word: string;
  meaning: string;
  example: string;
}) {
  const { cvs, clearRef } = useDrawingCanvas(word, "#7c3aed");
  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50/40 overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="font-heading text-lg text-primary-700">{word}</p>
          <button
            type="button"
            onClick={() => clearRef.current()}
            className="text-xs text-foreground-400 hover:text-foreground-600 cursor-pointer"
          >
            지우기
          </button>
        </div>
        <p className="text-xs text-foreground-600 leading-snug mb-1">{meaning}</p>
        <p className="text-xs text-foreground-400 italic leading-snug">"{example}"</p>
      </div>
      <canvas
        ref={cvs}
        width={300}
        height={130}
        className="w-full block"
        style={{
          cursor: "crosshair",
          background: "#f5f3ff",
          borderTop: "1px solid #ddd6fe",
        }}
      />
    </div>
  );
}

export function SuinVocabActivity({ onAllSeen }: { onAllSeen?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(false);
  const onAllSeenRef = useRef(onAllSeen);
  useEffect(() => { onAllSeenRef.current = onAllSeen; });

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (idx === SUIN_VOCAB.length - 1 && !seen) {
      setSeen(true);
      onAllSeenRef.current?.();
    }
  };

  return (
    <Carousel
      count={SUIN_VOCAB.length}
      current={current}
      onPrev={() => goTo(Math.max(0, current - 1))}
      onNext={() => goTo(Math.min(SUIN_VOCAB.length - 1, current + 1))}
    >
      <div style={{ overflow: "hidden", borderRadius: 16 }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.3s ease",
          }}
        >
          {SUIN_VOCAB.map((v) => (
            <div key={v.word} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <VocabDrawingCard word={v.word} meaning={v.meaning} example={v.example} />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  );
}
