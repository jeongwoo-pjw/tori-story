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
      return { x: ((e.clientX - r.left) / r.width) * canvas.width, y: ((e.clientY - r.top) / r.height) * canvas.height };
    };
    const start = (pos: { x: number; y: number }) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(pos.x, pos.y); };
    const move = (pos: { x: number; y: number }) => {
      if (!isDrawing) return;
      ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = strokeColor; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
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
function Carousel({ count, current, onPrev, onNext, children }: { count: number; current: number; onPrev: () => void; onNext: () => void; children: React.ReactNode }) {
  return (
    <div className="px-8">
      <div className="relative">
        {current > 0 && (
          <button type="button" onClick={onPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 w-11 h-11 rounded-full bg-background-50 border border-background-200 shadow-md flex items-center justify-center text-foreground-600 hover:text-foreground-950 hover:bg-primary-50 cursor-pointer transition-all">
            <i className="ri-arrow-left-s-line text-2xl leading-none"></i>
          </button>
        )}
        {current < count - 1 && (
          <button type="button" onClick={onNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 w-11 h-11 rounded-full bg-background-50 border border-background-200 shadow-md flex items-center justify-center text-foreground-600 hover:text-foreground-950 hover:bg-primary-50 cursor-pointer transition-all">
            <i className="ri-arrow-right-s-line text-2xl leading-none"></i>
          </button>
        )}
        {children}
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={`rounded-full transition-all ${i === current ? "w-6 h-3 bg-primary-500" : "w-3 h-3 bg-background-300"}`} />
        ))}
      </div>
    </div>
  );
}

/* ── 씬 데이터 ──────────────────────────────────────────── */
const MIHEE_PAGES = [
  { image: "3_page1.png", text: "오늘은 마을에서 신나는 탈춤 축제가 열리는 날이에요." },
  { image: "3_page2.png", text: "미희는 공연장 옆에서 예쁜 탈을 발견했어요." },
  { image: "3_page3.png", text: "친구들은 신나게 놀고 있었지만 그 아이는 외로워 보였어요." },
  { image: "3_page4.png", text: "미희는 자신이 가진 탈을 친구에게 건네주었어요." },
  { image: "3_page5.png", text: "두 친구는 함께 탈을 쓰고 탈춤을 추었어요." },
  { image: "3_page6.png", text: "축제가 끝날 무렵 두 친구는 손을 꼭 잡았어요." },
];

function shuffleCards(): number[] {
  const arr = [0, 1, 2, 3, 4, 5];
  for (let i = 5; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.every((v, i) => v === i)) { [arr[0], arr[1]] = [arr[1], arr[0]]; }
  return arr;
}

/* ── 카드 순서 맞추기 ───────────────────────────────────── */
export function MiheeCardSortActivity({ onSolved }: { onSolved?: () => void }) {
  const [order, setOrder] = useState<number[]>(shuffleCards);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const touchDragRef = useRef<{ startPos: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const onSolvedRef = useRef(onSolved);
  useEffect(() => { onSolvedRef.current = onSolved; });

  const swap = (a: number, b: number) => {
    if (a === b) return;
    setHasAttempted(true);
    const next = [...order];
    [next[a], next[b]] = [next[b], next[a]];
    setOrder(next);
    if (next.every((v, i) => v === i)) {
      setSolved(true);
      onSolvedRef.current?.();
    }
  };

  const getPosFromPoint = (x: number, y: number): number | null => {
    if (!listRef.current) return null;
    const items = listRef.current.querySelectorAll<HTMLElement>("[data-pos]");
    for (const item of items) {
      const r = item.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return parseInt(item.dataset.pos!, 10);
      }
    }
    return null;
  };

  const wrongPositions = order.map((cardIdx, pos) => !solved && cardIdx !== pos);
  const hasWrong = wrongPositions.some(Boolean);

  return (
    <div>
      <p className="text-xs text-foreground-500 mb-3 text-center">카드를 끌어서 순서를 바꿀 수 있어요.</p>
      <div ref={listRef} className="flex flex-col gap-2">
        {order.map((pageIdx, pos) => {
          const page = MIHEE_PAGES[pageIdx];
          const isDragging = dragging === pos;
          const isOver = dragOver === pos && dragging !== pos;
          const isWrong = hasAttempted && wrongPositions[pos];
          return (
            <div
              key={pos}
              data-pos={pos}
              draggable={!solved}
              onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; setDragging(pos); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(pos); }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging !== null) swap(dragging, pos);
                setDragging(null);
                setDragOver(null);
              }}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
              onTouchStart={() => { touchDragRef.current = { startPos: pos }; setDragging(pos); }}
              onTouchMove={(e) => {
                if (!touchDragRef.current) return;
                setDragOver(getPosFromPoint(e.touches[0].clientX, e.touches[0].clientY));
              }}
              onTouchEnd={(e) => {
                if (touchDragRef.current) {
                  const over = getPosFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                  if (over !== null) swap(touchDragRef.current.startPos, over);
                }
                touchDragRef.current = null;
                setDragging(null);
                setDragOver(null);
              }}
              className="flex items-center gap-3 rounded-xl border p-2 select-none"
              style={{
                borderColor: isOver ? "#8b5cf6" : isWrong ? "#fca5a5" : "#e5e7eb",
                background: isWrong ? "#fef2f2" : "#fafafa",
                outline: isOver ? "2px solid #8b5cf6" : "none",
                outlineOffset: -2,
                opacity: isDragging ? 0.5 : 1,
                cursor: solved ? "default" : "grab",
                touchAction: "none",
                transition: "opacity 0.15s, border-color 0.2s, background 0.2s",
              }}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-label font-bold flex items-center justify-center">
                {pos + 1}
              </span>
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden bg-secondary-100"
                style={{ width: 56, height: 42 }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${__BASE_PATH__}books/${page.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <p className="text-xs font-label text-foreground-700 leading-snug flex-1 line-clamp-2">
                {page.text}
              </p>
              {!solved && (
                <i className="ri-drag-move-line text-foreground-300 flex-shrink-0 text-base"></i>
              )}
            </div>
          );
        })}
      </div>
      {hasAttempted && !solved && hasWrong && (
        <p className="text-sm text-center text-red-500 font-label mt-3 font-semibold">순서를 다시 기억해봐요 🔄</p>
      )}
      {solved && (
        <div className="mt-4 text-center">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-label text-emerald-700 mt-1 font-semibold">순서를 맞췄어요!</p>
        </div>
      )}
    </div>
  );
}

/* ── 어휘 데이터 ──────────────────────────────────────── */
export const MIHEE_VOCAB = [
  { word: "탈춤", meaning: "탈을 쓰고 음악에 맞춰 추는 우리나라 전통 춤이에요.", example: "마을에서 신나는 탈춤 축제가 열렸어요.", color: "#f97316" },
  { word: "탈", meaning: "얼굴을 가리는 가면이에요.", example: "미희는 공연장 옆에서 예쁜 탈을 발견했어요.", color: "#8b5cf6" },
  { word: "축제", meaning: "여럿이 모여 즐겁게 함께 노는 날이에요.", example: "오늘은 마을에서 탈춤 축제가 열렸어요.", color: "#0ea5e9" },
  { word: "우정", meaning: "친구 사이의 따뜻한 마음이에요.", example: "미희는 우정의 소중함을 알게 되었어요.", color: "#10b981" },
  { word: "나눔", meaning: "자신의 것을 다른 사람에게 주는 거예요.", example: "함께 나누니 즐거움도 두 배가 되었어요.", color: "#f59e0b" },
  { word: "공연", meaning: "여러 사람 앞에서 춤이나 노래를 보여주는 거예요.", example: "두 친구는 함께 신나는 공연을 펼쳤어요.", color: "#ec4899" },
];

/* ── 어휘 카드 (캔버스) ─────────────────────────────── */
function MiheeVocabCard({ word, meaning, example, color }: { word: string; meaning: string; example: string; color: string }) {
  const { cvs, clearRef } = useDrawingCanvas(word, color);
  return (
    <div className="rounded-2xl border border-primary-200 bg-primary-50/40 overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="font-heading text-lg text-primary-700">{word}</p>
          <button type="button" onClick={() => clearRef.current()} className="text-xs text-foreground-400 hover:text-foreground-600 cursor-pointer">
            지우기
          </button>
        </div>
        <p className="text-xs text-foreground-600 leading-snug mb-1">{meaning}</p>
        <p className="text-xs text-foreground-400 italic leading-snug">"{example}"</p>
      </div>
      <canvas ref={cvs} width={300} height={130} className="w-full block" style={{ cursor: "crosshair", background: "#f5f3ff", borderTop: "1px solid #ddd6fe" }} />
    </div>
  );
}

/* ── 어휘 캐러셀 ─────────────────────────────────────── */
export function MiheeVocabActivity({ onAllSeen }: { onAllSeen?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(false);
  const onAllSeenRef = useRef(onAllSeen);
  useEffect(() => { onAllSeenRef.current = onAllSeen; });

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (idx === MIHEE_VOCAB.length - 1 && !seen) {
      setSeen(true);
      onAllSeenRef.current?.();
    }
  };

  return (
    <Carousel
      count={MIHEE_VOCAB.length}
      current={current}
      onPrev={() => goTo(Math.max(0, current - 1))}
      onNext={() => goTo(Math.min(MIHEE_VOCAB.length - 1, current + 1))}
    >
      <div style={{ overflow: "hidden", borderRadius: 16 }}>
        <div style={{ display: "flex", transform: `translateX(-${current * 100}%)`, transition: "transform 0.3s ease" }}>
          {MIHEE_VOCAB.map((v) => (
            <div key={v.word} style={{ flex: "0 0 100%", minWidth: 0 }}>
              <MiheeVocabCard word={v.word} meaning={v.meaning} example={v.example} color={v.color} />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  );
}

/* ── 창의력 카드 ─────────────────────────────────────── */
export function MiheeCreativeCard() {
  return (
    <div className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden mb-4">
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0 rounded-xl overflow-hidden bg-secondary-100" style={{ width: 96, aspectRatio: "3/4" }}>
          <img src={`${__BASE_PATH__}books/3_thumbnail.png`} alt="미희와 신나는 탈춤 축제" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-base text-foreground-950 mb-2 leading-snug">
            미희와 신나는 탈춤 축제
          </p>
          <div className="space-y-2 text-sm text-foreground-600 leading-relaxed">
            <div>
              <span className="font-semibold text-primary-700">줄거리 </span>
              미희는 탈춤 축제에서 외로운 친구를 발견하고, 자신이 가진 예쁜 탈을 친구에게 건네주었어요.
            </div>
            <div>
              <span className="font-semibold text-primary-700">결말 </span>
              두 친구는 함께 탈을 쓰고 신나게 탈춤을 추었고, 축제가 끝날 무렵 손을 꼭 잡았어요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 어휘 퀴즈 (뜻 → 낱말 입력) ────────────────────────── */
export function MiheeVocabQuiz({
  vocabWords,
  answers,
  onChange,
}: {
  vocabWords: { word: string; meaning: string; example: string }[];
  answers: Record<number, string>;
  onChange: (idx: number, answer: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-foreground-500 text-center">뜻을 읽고 낱말을 입력해보세요!</p>
      {vocabWords.map((v, i) => (
        <div key={i} className="rounded-xl border border-primary-200 bg-primary-50/40 p-4">
          <p className="text-xs text-foreground-500 mb-1">이 낱말의 뜻이에요:</p>
          <p className="text-sm font-label text-foreground-800 leading-snug mb-1">{v.meaning}</p>
          <p className="text-xs text-foreground-400 italic mb-3">"{v.example}"</p>
          <input
            type="text"
            value={answers[i] ?? ""}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder="낱말을 입력해보세요..."
            className="w-full rounded-lg border border-background-200 bg-background-50 px-3 py-2 text-sm font-label text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
          />
        </div>
      ))}
    </div>
  );
}
