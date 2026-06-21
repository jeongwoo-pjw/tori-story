import { useState, useEffect, useRef } from "react";

const T_COLS = 10, T_ROWS = 20;
const NEXT_COUNT = 3;
const CW = 260, CH = 520, CELL = CW / T_COLS;
const NW = 80, NH = 240, HW = 80, HH = 80;

const SHAPES: Record<string, { color: string; blocks: number[][] }> = {
  I: { color: "#00e0ff", blocks: [[1, 1, 1, 1]] },
  O: { color: "#ffe04a", blocks: [[1, 1], [1, 1]] },
  T: { color: "#b56cff", blocks: [[0, 1, 0], [1, 1, 1]] },
  S: { color: "#5eea84", blocks: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: "#ff4a6e", blocks: [[1, 1, 0], [0, 1, 1]] },
  J: { color: "#4287ff", blocks: [[1, 0, 0], [1, 1, 1]] },
  L: { color: "#ff8a3e", blocks: [[0, 0, 1], [1, 1, 1]] },
};
const SHAPE_KEYS = Object.keys(SHAPES);

type Piece = { key: string; blocks: number[][]; color: string };

function makeGrid(): (string | null)[][] {
  return Array.from({ length: T_ROWS }, () => Array(T_COLS).fill(null));
}

function rotateCW(blocks: number[][]): number[][] {
  const N = blocks.length, M = blocks[0].length;
  const out: number[][] = Array.from({ length: M }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) for (let c = 0; c < M; c++) out[c][N - 1 - r] = blocks[r][c];
  return out;
}

export default function TetrisGame({ onExit }: { onExit: () => void }) {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);
  const holdRef = useRef<HTMLCanvasElement>(null);

  const s = useRef({
    grid: makeGrid(),
    cur: null as Piece | null,
    cx: 0, cy: 0,
    queue: [] as string[],
    hold: null as Piece | null,
    holdLock: false,
    score: 0, lines: 0, level: 1,
    best: parseInt(localStorage.getItem("tetris-best") || "0", 10),
    running: false, paused: false,
    dropTimer: 0, lastTime: 0, raf: 0,
  });

  const [hud, setHud] = useState({ score: 0, lines: 0, level: 1, best: parseInt(localStorage.getItem("tetris-best") || "0", 10) });
  const [overlay, setOverlay] = useState({ show: true, title: "TETRIS", sub: "방향키로 블록을 이동하세요", btn: "게임 시작" });

  function makePiece(key: string): Piece {
    return { key, blocks: SHAPES[key].blocks.map((r) => [...r]), color: SHAPES[key].color };
  }

  function spawnBag(): string[] {
    return [...SHAPE_KEYS].sort(() => Math.random() - 0.5);
  }

  function getNextPiece(): Piece {
    if (s.current.queue.length < 7) s.current.queue.push(...spawnBag());
    const key = s.current.queue.shift()!;
    return makePiece(key);
  }

  function collides(x: number, y: number, blocks: number[][]): boolean {
    for (let r = 0; r < blocks.length; r++) {
      for (let c = 0; c < blocks[r].length; c++) {
        if (!blocks[r][c]) continue;
        const nx = x + c, ny = y + r;
        if (nx < 0 || nx >= T_COLS || ny >= T_ROWS) return true;
        if (ny >= 0 && s.current.grid[ny][nx]) return true;
      }
    }
    return false;
  }

  function spawn() {
    const piece = getNextPiece();
    s.current.cur = piece;
    s.current.cx = Math.floor((T_COLS - piece.blocks[0].length) / 2);
    s.current.cy = -piece.blocks.length + 1;
    if (collides(s.current.cx, s.current.cy, piece.blocks)) endGame();
  }

  function lockPiece() {
    const { cur, cx, cy, grid } = s.current;
    if (!cur) return;
    cur.blocks.forEach((row, r) =>
      row.forEach((v, c) => { if (v && cy + r >= 0) grid[cy + r][cx + c] = cur.color; })
    );
    clearLines();
    s.current.holdLock = false;
    spawn();
  }

  function clearLines() {
    const { grid } = s.current;
    let cleared = 0;
    for (let r = T_ROWS - 1; r >= 0; r--) {
      if (grid[r].every((v) => v !== null)) {
        grid.splice(r, 1);
        grid.unshift(Array(T_COLS).fill(null));
        cleared++;
        r++;
      }
    }
    if (cleared) {
      const pts = [0, 100, 300, 500, 800][cleared] * s.current.level;
      s.current.score += pts;
      s.current.lines += cleared;
      s.current.level = Math.floor(s.current.lines / 10) + 1;
      if (s.current.score > s.current.best) {
        s.current.best = s.current.score;
        localStorage.setItem("tetris-best", String(s.current.best));
      }
      setHud({ score: s.current.score, lines: s.current.lines, level: s.current.level, best: s.current.best });
    }
  }

  function movePiece(dx: number, dy: number): boolean {
    const { cur, cx, cy } = s.current;
    if (!cur) return false;
    if (!collides(cx + dx, cy + dy, cur.blocks)) {
      s.current.cx += dx; s.current.cy += dy;
      return true;
    }
    return false;
  }

  function tryRotate() {
    const { cur, cx, cy } = s.current;
    if (!cur) return;
    const rot = rotateCW(cur.blocks);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (!collides(cx + dx, cy, rot)) { cur.blocks = rot; s.current.cx += dx; return; }
    }
  }

  function hardDrop() {
    let drops = 0;
    while (movePiece(0, 1)) drops++;
    s.current.score += drops * 2;
    setHud((h) => ({ ...h, score: s.current.score }));
    lockPiece();
  }

  function holdPiece() {
    const { holdLock, cur } = s.current;
    if (holdLock || !cur) return;
    s.current.holdLock = true;
    if (s.current.hold) {
      const tmp = s.current.hold;
      s.current.hold = makePiece(cur.key);
      s.current.cur = makePiece(tmp.key);
      s.current.cx = Math.floor((T_COLS - s.current.cur.blocks[0].length) / 2);
      s.current.cy = -s.current.cur.blocks.length + 1;
    } else {
      s.current.hold = makePiece(cur.key);
      spawn();
    }
  }

  function getGhostY(): number {
    const { cur, cx, cy } = s.current;
    if (!cur) return 0;
    let y = cy;
    while (!collides(cx, y + 1, cur.blocks)) y++;
    return y;
  }

  function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 1, y + 1, CELL - 2, 4);
    ctx.globalAlpha = 1;
  }

  function drawPanel(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pieces: (typeof SHAPES)[string][]) {
    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cs = 16;
    pieces.forEach((p, i) => {
      const w = p.blocks[0].length, h = p.blocks.length;
      const offX = (canvas.width - w * cs) / 2;
      const startY = pieces.length > 1 ? i * 80 + 10 : (canvas.height - h * cs) / 2;
      p.blocks.forEach((row, r) =>
        row.forEach((v, c) => {
          if (v) {
            ctx.fillStyle = p.color;
            ctx.fillRect(offX + c * cs + 1, startY + r * cs + 1, cs - 2, cs - 2);
          }
        })
      );
    });
  }

  function drawAll() {
    const canvas = mainRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const { grid, cur, cx, cy } = s.current;

    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = "#15152a"; ctx.lineWidth = 1;
    for (let i = 1; i < T_COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, CH); ctx.stroke(); }
    for (let i = 1; i < T_ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(CW, i * CELL); ctx.stroke(); }

    for (let r = 0; r < T_ROWS; r++)
      for (let c = 0; c < T_COLS; c++)
        if (grid[r][c]) drawCell(ctx, c * CELL, r * CELL, grid[r][c] as string);

    if (cur) {
      const gy = getGhostY();
      cur.blocks.forEach((row, r) => row.forEach((v, c) => { if (v) drawCell(ctx, (cx + c) * CELL, (gy + r) * CELL, cur.color, 0.18); }));
      cur.blocks.forEach((row, r) => row.forEach((v, c) => { if (v && cy + r >= 0) drawCell(ctx, (cx + c) * CELL, (cy + r) * CELL, cur.color); }));
    }

    const nc = nextRef.current; const hc = holdRef.current;
    if (nc) { const nCtx = nc.getContext("2d"); if (nCtx) drawPanel(nCtx, nc, s.current.queue.slice(0, NEXT_COUNT).map((k) => SHAPES[k])); }
    if (hc) { const hCtx = hc.getContext("2d"); if (hCtx) drawPanel(hCtx, hc, s.current.hold ? [SHAPES[s.current.hold.key]] : []); }
  }

  function tick(time: number) {
    if (!s.current.running) return;
    if (!s.current.paused) {
      if (!s.current.lastTime) s.current.lastTime = time;
      const delta = time - s.current.lastTime;
      s.current.lastTime = time;
      s.current.dropTimer += delta;
      const interval = Math.max(80, 800 - (s.current.level - 1) * 60);
      if (s.current.dropTimer > interval) {
        if (!movePiece(0, 1)) lockPiece();
        s.current.dropTimer = 0;
      }
      drawAll();
    }
    s.current.raf = requestAnimationFrame(tick);
  }

  function startGame() {
    s.current.grid = makeGrid();
    s.current.queue = [];
    s.current.hold = null;
    s.current.holdLock = false;
    s.current.score = 0; s.current.lines = 0; s.current.level = 1;
    s.current.dropTimer = 0; s.current.lastTime = 0;
    s.current.running = true; s.current.paused = false;
    setHud({ score: 0, lines: 0, level: 1, best: s.current.best });
    setOverlay({ show: false, title: "", sub: "", btn: "" });
    cancelAnimationFrame(s.current.raf);
    spawn();
    s.current.raf = requestAnimationFrame(tick);
    drawAll();
  }

  function endGame() {
    s.current.running = false;
    cancelAnimationFrame(s.current.raf);
    const { score, lines, level, best } = s.current;
    setOverlay({
      show: true,
      title: "게임 오버",
      sub: `점수 ${score.toLocaleString("ko-KR")} · ${lines}줄 · 레벨 ${level}${score === best && score > 0 ? " 🏆 최고기록!" : ""}`,
      btn: "↻ 다시 시작",
    });
  }

  function togglePause() {
    if (!s.current.running) return;
    s.current.paused = !s.current.paused;
    if (s.current.paused) {
      setOverlay({ show: true, title: "일시정지", sub: "P 또는 스페이스로 재개", btn: "재개" });
    } else {
      s.current.lastTime = 0;
      setOverlay({ show: false, title: "", sub: "", btn: "" });
    }
  }

  useEffect(() => {
    const canvas = mainRef.current;
    if (canvas) { const ctx = canvas.getContext("2d"); if (ctx) { ctx.fillStyle = "#0a0a14"; ctx.fillRect(0, 0, CW, CH); } }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " && !s.current.running) { e.preventDefault(); startGame(); return; }
      if (e.key === "p" || e.key === "P") { togglePause(); return; }
      if (!s.current.running || s.current.paused) return;
      switch (e.key) {
        case "ArrowLeft": movePiece(-1, 0); drawAll(); break;
        case "ArrowRight": movePiece(1, 0); drawAll(); break;
        case "ArrowDown": if (movePiece(0, 1)) { s.current.score++; setHud((h) => ({ ...h, score: s.current.score })); } drawAll(); break;
        case "ArrowUp": tryRotate(); drawAll(); break;
        case " ": e.preventDefault(); hardDrop(); drawAll(); break;
        case "c": case "C": holdPiece(); drawAll(); break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); cancelAnimationFrame(s.current.raf); };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a14] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button type="button" onClick={onExit} className="text-sm font-label text-white/70 hover:text-white flex items-center gap-1 cursor-pointer">
          ← 돌아가기
        </button>
        <span className="font-label font-bold tracking-widest text-[#6efff1]">TETRIS</span>
        <div className="w-20" />
      </div>

      <div className="flex-1 flex items-start justify-center gap-3 p-3 overflow-auto">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-label text-white/40 tracking-wider">HOLD</span>
          <canvas ref={holdRef} width={HW} height={HH} className="rounded border border-white/10" />
          <div className="flex flex-col gap-2 text-xs font-label mt-2">
            <div><div className="text-white/40 text-[10px]">점수</div><div className="text-white font-bold">{hud.score.toLocaleString("ko-KR")}</div></div>
            <div><div className="text-white/40 text-[10px]">최고</div><div style={{ color: "#ffd93d" }} className="font-bold">{hud.best.toLocaleString("ko-KR")}</div></div>
            <div><div className="text-white/40 text-[10px]">줄</div><div className="text-white font-bold">{hud.lines}</div></div>
            <div><div className="text-white/40 text-[10px]">레벨</div><div style={{ color: "#6efff1" }} className="font-bold">{hud.level}</div></div>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <canvas ref={mainRef} width={CW} height={CH} className="rounded border border-white/10 block" />
          {overlay.show && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded p-5 text-center" style={{ background: "rgba(10,14,31,.92)" }}>
              <h2 className="text-2xl font-label font-bold tracking-wider" style={{ color: "#eef0fa" }}>{overlay.title}</h2>
              <p className="text-sm font-label" style={{ color: "#8b91b5" }}>{overlay.sub}</p>
              <button
                type="button"
                onClick={() => { if (s.current.paused) togglePause(); else startGame(); }}
                className="mt-2 px-7 py-3 rounded-full font-label font-bold text-sm cursor-pointer hover:brightness-110 transition-all"
                style={{ background: "#6efff1", color: "#0a0e1f" }}
              >
                {overlay.btn}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-label text-white/40 tracking-wider">NEXT</span>
          <canvas ref={nextRef} width={NW} height={NH} className="rounded border border-white/10" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 pb-4 px-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => { holdPiece(); drawAll(); }} className="w-14 h-9 rounded-xl bg-white/10 font-label text-xs text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">HOLD</button>
          <button type="button" onClick={() => { tryRotate(); drawAll(); }} className="w-14 h-9 rounded-xl bg-white/10 font-label text-lg text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">↑</button>
          <button type="button" onClick={() => { hardDrop(); drawAll(); }} className="w-14 h-9 rounded-xl bg-white/10 font-label text-xs text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">DROP</button>
          <button type="button" onClick={togglePause} className="w-14 h-9 rounded-xl bg-white/10 font-label text-xs text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">⏸</button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { movePiece(-1, 0); drawAll(); }} className="w-16 h-11 rounded-xl bg-white/10 font-label text-xl text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">←</button>
          <button type="button" onClick={() => { if (movePiece(0, 1)) { s.current.score++; setHud((h) => ({ ...h, score: s.current.score })); } drawAll(); }} className="w-16 h-11 rounded-xl bg-white/10 font-label text-xl text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">↓</button>
          <button type="button" onClick={() => { movePiece(1, 0); drawAll(); }} className="w-16 h-11 rounded-xl bg-white/10 font-label text-xl text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all">→</button>
        </div>
        <p className="text-[10px] font-label text-white/30">C=홀드 · 스페이스=하드드롭 · P=일시정지</p>
      </div>
    </main>
  );
}
