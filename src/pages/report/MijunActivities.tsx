import { useState, useEffect, useRef } from "react";

/* ── 드로잉 훅 ─────────────────────────────────────────── */
function useDrawingCanvas(word: string, strokeColor: string) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const clearRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;

    const drawGuide = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const byWidth = Math.floor((canvas.width * 0.72) / Math.max(word.length, 1));
      const byHeight = Math.floor(canvas.height * 0.72);
      ctx.font = `bold ${Math.min(byWidth, byHeight)}px sans-serif`;
      ctx.fillStyle = "rgba(139,92,246,0.18)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(word, canvas.width / 2, canvas.height / 2);
    };

    clearRef.current = () => { drawGuide(); };
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

/* ── 캐러셀 ────────────────────────────────────────────── */
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
              i === current ? "w-6 h-3 bg-primary-500" : "w-3 h-3 bg-background-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 퍼즐 (9조각 3×3) ──────────────────────────────────── */
function shufflePuzzle9(): number[] {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let tries = 0;
  do {
    for (let i = 8; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    tries++;
  } while (arr.every((v, i) => v === i) && tries < 20);
  return arr;
}

export function MijunPuzzleActivity({
  pieceSrc,
  onReady,
}: {
  pieceSrc: string;
  onReady: () => void;
}) {
  const [order, setOrder] = useState<number[]>(shufflePuzzle9);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const touchDragRef = useRef<{ startPos: number } | null>(null);
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

  const onTouchStart = (pos: number) => () => {
    touchDragRef.current = { startPos: pos };
    setDragging(pos);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchDragRef.current) return;
    setDragOver(getPosFromPoint(e.touches[0].clientX, e.touches[0].clientY));
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchDragRef.current) {
      const over = getPosFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      if (over !== null) swap(touchDragRef.current.startPos, over);
    }
    touchDragRef.current = null;
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div>
      <p className="text-xs text-foreground-500 mb-3 text-center">퍼즐을 맞춰 용기를 완성해요.</p>
      <p className="text-sm font-label text-foreground-600 mb-3 text-center">
        조각을 드래그해서 그림을 완성해봐요!
      </p>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 4,
          width: "100%",
          aspectRatio: "1/1",
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
                backgroundImage: pieceSrc ? `url(${pieceSrc})` : undefined,
                backgroundSize: "300% 300%",
                backgroundPosition: `${col * 50}% ${row * 50}%`,
                backgroundColor: pieceSrc ? undefined : "#e9e4f5",
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

/* ── 창의력 카드 ────────────────────────────────────────── */
export function MijunCreativeCard() {
  return (
    <div className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden mb-4">
      <div className="flex gap-4 p-4">
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden bg-secondary-100"
          style={{ width: 96, aspectRatio: "3/4" }}
        >
          <img
            src={`${__BASE_PATH__}books/2_thumbnail.png`}
            alt="민준이의 한복 여행"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-base text-foreground-950 mb-2 leading-snug">
            민준이의 용기있는 한복 여행
          </p>
          <div className="space-y-2 text-sm text-foreground-600 leading-relaxed">
            <div>
              <span className="font-semibold text-primary-700">줄거리 </span>
              민준이는 마을 축제에서 낯선 친구들에게 먼저 인사를 건네고, 함께 징검다리 건너기 놀이에 도전하며 새 친구를 사귀었어요.
            </div>
            <div>
              <span className="font-semibold text-primary-700">결말 </span>
              축제가 끝나고 민준이는 새 친구들과 손을 맞잡았어요. 용기를 냈던 자신이 뿌듯했답니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 어휘 활동 (6낱말 캐러셀) ───────────────────────────── */
const MIJUN_VOCAB = [
  { word: "용기", meaning: "어렵거나 무서운 일을 겁내지 않고 씩씩하게 하는 마음이에요.", example: "민준이는 용기를 내어 친구에게 먼저 인사를 건넸어요.", color: "#f97316" },
  { word: "한복", meaning: "우리나라 고유의 예쁜 옷이에요. 축제나 특별한 날에 입어요.", example: "민준이는 고운 한복을 입고 축제에 나섰어요.", color: "#8b5cf6" },
  { word: "징검다리", meaning: "강이나 냇가에 돌을 놓아 건너게 만든 다리예요.", example: "친구들이 징검다리를 깡충깡충 건너고 있었어요.", color: "#0ea5e9" },
  { word: "자신감", meaning: "내가 할 수 있다는 믿음이에요. 어려운 일도 해낼 수 있어요.", example: "민준이는 점점 자신감을 얻었어요.", color: "#10b981" },
  { word: "축제", meaning: "여러 사람이 모여 즐겁게 노는 행사예요.", example: "마을에 신나는 축제가 열렸어요.", color: "#f59e0b" },
  { word: "응원", meaning: "열심히 하도록 힘을 북돋아 주는 것이에요.", example: "친구들이 박수를 치며 응원해 주었어요.", color: "#ec4899" },
];

function MijunVocabCard({
  word,
  meaning,
  example,
  color,
}: {
  word: string;
  meaning: string;
  example: string;
  color: string;
}) {
  const { cvs, clearRef } = useDrawingCanvas(word, color);
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
        style={{ cursor: "crosshair", background: "#f5f3ff", borderTop: "1px solid #ddd6fe" }}
      />
    </div>
  );
}

export function MijunVocabActivity({ onAllSeen }: { onAllSeen?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(false);
  const onAllSeenRef = useRef(onAllSeen);
  useEffect(() => { onAllSeenRef.current = onAllSeen; });

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (idx === MIJUN_VOCAB.length - 1 && !seen) {
      setSeen(true);
      onAllSeenRef.current?.();
    }
  };

  return (
    <Carousel
      count={MIJUN_VOCAB.length}
      current={current}
      onPrev={() => goTo(Math.max(0, current - 1))}
      onNext={() => goTo(Math.min(MIJUN_VOCAB.length - 1, current + 1))}
    >
      <div style={{ overflow: "hidden", borderRadius: 16 }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.3s ease",
          }}
        >
          {MIJUN_VOCAB.map((v) => (
            <div key={v.word} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <MijunVocabCard word={v.word} meaning={v.meaning} example={v.example} color={v.color} />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  );
}
