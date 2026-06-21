import { useState, useEffect, useRef } from "react";

const EMOJIS = ["🦊", "🐼", "🐯", "🐸", "🦁", "🐶", "🐰", "🐧", "🦄", "🐙", "🦋", "🐢"];

const LEVELS = {
  easy:   { cols: 3, pairs: 6,  label: "쉬움" },
  normal: { cols: 4, pairs: 8,  label: "보통" },
  hard:   { cols: 4, pairs: 10, label: "어려움" },
};

type LevelKey = keyof typeof LEVELS;

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function fmt(ms: number): string {
  const total = Math.floor(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function bestKey(lv: LevelKey) { return `match-best-${lv}`; }
function loadBest(lv: LevelKey) { return parseInt(localStorage.getItem(bestKey(lv)) || "0", 10); }

function buildDeck(lv: LevelKey): Card[] {
  const { pairs } = LEVELS[lv];
  const emojis = EMOJIS.slice(0, pairs);
  return shuffle([...emojis, ...emojis]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

export default function MemoryMatchGame({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState<LevelKey>("normal");
  const [cards, setCards] = useState<Card[]>(() => buildDeck("normal"));
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [won, setWon] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [lock, setLock] = useState(false);
  const startedAt = useRef(Date.now());
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (timerId.current) clearInterval(timerId.current);
    startedAt.current = Date.now();
    setTimeMs(0);
    timerId.current = setInterval(() => setTimeMs(Date.now() - startedAt.current), 250);
  }

  function resetGame(lv: LevelKey = level) {
    setCards(buildDeck(lv));
    setMoves(0);
    setMatched(0);
    setWon(false);
    setIsNewBest(false);
    setLock(false);
    startTimer();
  }

  useEffect(() => {
    startTimer();
    return () => { if (timerId.current) clearInterval(timerId.current); };
  }, []);

  const cfg = LEVELS[level];

  function handleFlip(card: Card) {
    if (lock || card.flipped || card.matched) return;
    const flippedCount = cards.filter((c) => c.flipped && !c.matched).length;
    if (flippedCount >= 2) return;

    const newCards = cards.map((c) => c.id === card.id ? { ...c, flipped: true } : c);
    setCards(newCards);

    const nowFlipped = newCards.filter((c) => c.flipped && !c.matched);
    if (nowFlipped.length === 2) {
      const [a, b] = nowFlipped;
      const newMoves = moves + 1;
      setMoves(newMoves);

      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => c.emoji === a.emoji ? { ...c, matched: true, flipped: false } : c));
          const newMatched = matched + 1;
          setMatched(newMatched);
          if (newMatched === cfg.pairs) {
            if (timerId.current) clearInterval(timerId.current);
            const ms = Date.now() - startedAt.current;
            const cur = loadBest(level);
            const isBetter = !cur || ms < cur;
            if (isBetter) localStorage.setItem(bestKey(level), String(ms));
            setIsNewBest(isBetter);
            setWon(true);
          }
        }, 350);
      } else {
        setLock(true);
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a.id || c.id === b.id) ? { ...c, flipped: false } : c));
          setLock(false);
        }, 700);
      }
    }
  }

  const colClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4" };

  return (
    <div className="flex flex-col text-white" style={{ background: "#0f1020" }}>
      <div className="flex items-center justify-between px-4 py-2 gap-4 text-xs font-label border-b border-white/10">
        <div className="flex gap-4">
          <div><span className="text-white/40">시간 </span><span className="text-white font-bold">{fmt(timeMs)}</span></div>
          <div><span className="text-white/40">이동 </span><span className="text-white font-bold">{moves}</span></div>
          <div><span className="text-white/40">찾음 </span><span className="font-bold" style={{ color: "#5eea84" }}>{matched}/{cfg.pairs}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={level}
            onChange={(e) => { const lv = e.target.value as LevelKey; setLevel(lv); resetGame(lv); }}
            className="bg-white/10 text-white text-xs font-label px-2 py-1 rounded border border-white/20 cursor-pointer"
          >
            {(Object.entries(LEVELS) as [LevelKey, typeof LEVELS[LevelKey]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <button type="button" onClick={() => resetGame()} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-label cursor-pointer transition-colors">↻</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`grid ${colClass[cfg.cols]} gap-2.5 w-full max-w-sm`}>
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card)}
              disabled={card.matched || lock}
              className="aspect-square cursor-pointer disabled:cursor-default"
              style={{ perspective: "600px" }}
            >
              <div
                style={{
                  width: "100%", height: "100%",
                  transition: "transform 0.35s",
                  transformStyle: "preserve-3d",
                  transform: (card.flipped || card.matched) ? "rotateY(180deg)" : "rotateY(0deg)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    borderRadius: "0.75rem",
                    background: "#1e1e3a",
                    border: "2px solid #3a3a5c",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🌟</span>
                </div>
                <div
                  style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "0.75rem",
                    background: card.matched ? "linear-gradient(135deg,#1a3a1a,#0f2a0f)" : "linear-gradient(135deg,#1a1a3a,#0f0f2a)",
                    border: card.matched ? "2px solid #5eea84" : "2px solid #6060c0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{card.emoji}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pb-4 text-xs font-label text-white/30">
        최고 기록: {loadBest(level) ? fmt(loadBest(level)) : "없음"} ({cfg.label})
      </div>

      {won && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="bg-[#1a1a2e] rounded-2xl p-8 flex flex-col items-center gap-4 border border-white/20 max-w-xs w-full mx-4">
            <span className="text-4xl">🎉</span>
            <h2 className="text-xl font-label font-bold text-white">완료!</h2>
            <p className="text-sm font-label text-center text-white/70">
              {fmt(timeMs)} · {moves}회 이동
              {isNewBest && <><br /><span style={{ color: "#ffd93d" }}>🏆 새로운 최고 기록!</span></>}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => resetGame()}
                className="px-5 py-2.5 rounded-full font-label font-bold text-sm cursor-pointer hover:brightness-110 transition-all"
                style={{ background: "#a78bfa", color: "#0a0e1f" }}
              >
                다시 하기
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-5 py-2.5 rounded-full font-label font-bold text-sm bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
