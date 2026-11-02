import { useEffect, useMemo, useState } from "react";

/* =====================================================================
   YOUR PICTURES — put your images in the /public folder and write the
   path here, e.g. chestClosed: "/images/treasure-closed.png"
   Leave "" to use the built-in drawing.
   ===================================================================== */
const IMAGES = {
  pirate: "",       // the walking character
  ship: "",         // the ship at the start
  chestClosed: "",  // treasure box (closed)
  chestOpen: "",    // treasure box (open)
};

/* ---------- Data ---------- */
const YES = "Au ja, das macht Spaß!";
const NO = "Nein, keine Lust.";

// One island (maze) per game. n = maze size (bigger = harder)
const GAMES = [
  { id: "karten", emoji: "🃏", words: ["Spielen", "wir", "Karten"], n: 3 },
  { id: "federball", emoji: "🏸", words: ["Spielen", "wir", "Federball"], n: 3 },
  { id: "piraten", emoji: "🦜", words: ["Spielen", "wir", "Piraten"], n: 4 },
  { id: "mikado", emoji: "🥢", words: ["Spielen", "wir", "Mikado"], n: 4 },
  { id: "verstecken", emoji: "🙈", words: ["Spielen", "wir", "Verstecken"], n: 5 },
  { id: "ball", emoji: "⚽", words: ["Spielen", "wir", "mit", "dem", "Ball"], n: 5 },
];

const question = (g) => g.words.join(" ") + "?";

const speak = (text) => {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* speech not supported */
  }
};

/* ---------- Sound: sea waves + birds + small effects (no files needed) ---------- */
let audio = null;

function createAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  ctx.resume?.();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);

  // waves: soft noise that slowly swells and fades
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const wave = ctx.createGain();
  wave.gain.value = 0.18;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.14;
  lfo.connect(lfoGain);
  lfoGain.connect(wave.gain);
  src.connect(lp);
  lp.connect(wave);
  wave.connect(master);
  src.start();
  lfo.start();

  const tone = (freq, start, dur, vol = 0.1, type = "sine", to) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    if (to) o.frequency.exponentialRampToValueAtTime(to, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(master);
    o.start(start);
    o.stop(start + dur + 0.02);
  };

  // birds: little chirps at random times
  let timer;
  const chirp = () => {
    const t = ctx.currentTime;
    const base = 2200 + Math.random() * 1500;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) tone(base, t + i * 0.14, 0.1, 0.05, "sine", base * 1.35);
    timer = setTimeout(chirp, 2500 + Math.random() * 4500);
  };
  timer = setTimeout(chirp, 800);

  return {
    step: () => tone(260, ctx.currentTime, 0.06, 0.05, "triangle", 180),
    chime: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, ctx.currentTime + i * 0.12, 0.35, 0.12, "triangle")),
    mute: (m) => { master.gain.value = m ? 0 : 0.6; },
    stop: () => { clearTimeout(timer); ctx.close(); },
  };
}

/* ---------- Maze generation (random, always solvable) ---------- */
// 1 = bush (wall), 0 = sand (path). Size = 2n + 1
function makeMaze(n) {
  const W = 2 * n + 1;
  const g = Array.from({ length: W }, () => Array(W).fill(1));
  g[1][1] = 0;
  const stack = [[1, 1]];
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = [[0, 2], [2, 0], [0, -2], [-2, 0]]
      .sort(() => Math.random() - 0.5)
      .filter(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        return nr > 0 && nc > 0 && nr < W - 1 && nc < W - 1 && g[nr][nc] === 1;
      });
    if (!options.length) { stack.pop(); continue; }
    const [dr, dc] = options[0];
    g[r + dr / 2][c + dc / 2] = 0;
    g[r + dr][c + dc] = 0;
    stack.push([r + dr, c + dc]);
  }
  return g;
}

/* ---------- Pictures (your image, or the built-in drawing) ---------- */
function Pic({ src, children }) {
  return src ? <img src={src} alt="" draggable={false} className="h-full w-full object-contain" /> : children;
}

function PirateSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="35" y="78" width="11" height="15" rx="5.5" fill="#5b3a29" />
      <rect x="54" y="78" width="11" height="15" rx="5.5" fill="#5b3a29" />
      <rect x="29" y="52" width="42" height="33" rx="15" fill="#fff" />
      <rect x="31" y="61" width="38" height="6" fill="#e63946" />
      <rect x="32" y="73" width="36" height="6" fill="#e63946" />
      <circle cx="50" cy="38" r="23" fill="#ffd2a8" />
      <path d="M26 36 Q50 0 74 36 Q50 27 26 36Z" fill="#e63946" />
      <circle cx="40" cy="22" r="2.2" fill="#fff" />
      <circle cx="52" cy="17" r="2.2" fill="#fff" />
      <circle cx="62" cy="25" r="2.2" fill="#fff" />
      <circle cx="75" cy="38" r="5.5" fill="#e63946" />
      <circle cx="42" cy="42" r="4" fill="#222" />
      <circle cx="58" cy="42" r="4" fill="#222" />
      <circle cx="43.3" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="59.3" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="35" cy="50" r="4.2" fill="#ff9aa2" opacity=".75" />
      <circle cx="65" cy="50" r="4.2" fill="#ff9aa2" opacity=".75" />
      <path d="M43 50 Q50 58 57 50" stroke="#8a3b2a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="27" cy="48" r="3.5" fill="none" stroke="#f5b83d" strokeWidth="2" />
    </svg>
  );
}

function ChestClosedSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="14" y="46" width="72" height="40" rx="6" fill="#8b5a2b" />
      <path d="M14 48 Q14 18 50 18 Q86 18 86 48Z" fill="#a8702f" />
      <rect x="14" y="44" width="72" height="8" fill="#f5b83d" />
      <rect x="26" y="22" width="8" height="64" fill="#f5b83d" opacity=".9" />
      <rect x="66" y="22" width="8" height="64" fill="#f5b83d" opacity=".9" />
      <rect x="43" y="42" width="14" height="20" rx="3" fill="#ffd45e" stroke="#b7821c" strokeWidth="2" />
      <circle cx="50" cy="51" r="2.8" fill="#6b3f14" />
    </svg>
  );
}

function ChestOpenSVG() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <path d="M20 40 Q18 8 50 8 Q82 8 80 40Z" fill="#a8702f" />
      <rect x="14" y="46" width="72" height="40" rx="6" fill="#8b5a2b" />
      <ellipse cx="50" cy="48" rx="36" ry="9" fill="#4a2508" />
      <path d="M18 48 Q34 22 50 30 Q66 20 82 48Z" fill="#fcd34d" />
      <circle cx="36" cy="38" r="5" fill="#f59e0b" />
      <circle cx="62" cy="36" r="5" fill="#f59e0b" />
      <polygon points="50,24 57,32 50,40 43,32" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
      <rect x="14" y="52" width="72" height="8" fill="#f5b83d" />
      <rect x="26" y="52" width="8" height="34" fill="#f5b83d" opacity=".9" />
      <rect x="66" y="52" width="8" height="34" fill="#f5b83d" opacity=".9" />
    </svg>
  );
}

function Chest({ open, className = "" }) {
  return (
    <div className={className}>
      <Pic src={open ? IMAGES.chestOpen : IMAGES.chestClosed}>
        {open ? <ChestOpenSVG /> : <ChestClosedSVG />}
      </Pic>
    </div>
  );
}

/* ---------- One island ---------- */
const BOARD = "min(72vw, 64dvh, 44rem)"; // as big as the screen allows
const BEACH = `calc(${BOARD} * 1.2)`;

function Island({ game, index, onNext }) {
  const maze = useMemo(() => makeMaze(game.n), [game.n]);
  const W = maze.length;
  const goal = W - 2;

  const [pos, setPos] = useState([1, 1]);
  const [visited, setVisited] = useState(["1-1"]);
  const [facing, setFacing] = useState(1);
  const [steps, setSteps] = useState(0);
  const [bump, setBump] = useState(false);
  const [won, setWon] = useState(false);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(null);

  const move = (dr, dc) => {
    if (won) return;
    const [r, c] = pos;
    const nr = r + dr, nc = c + dc;
    if (dc !== 0) setFacing(dc);
    if (maze[nr]?.[nc] === 0) {
      setPos([nr, nc]);
      setSteps((s) => s + 1);
      setVisited((v) => (v.includes(`${nr}-${nc}`) ? v : [...v, `${nr}-${nc}`]));
      audio?.step();
    } else {
      setBump(true);
      setTimeout(() => setBump(false), 300);
    }
  };

  // keyboard (arrows / WASD)
  useEffect(() => {
    const keys = {
      ArrowUp: [-1, 0], w: [-1, 0], ArrowDown: [1, 0], s: [1, 0],
      ArrowLeft: [0, -1], a: [0, -1], ArrowRight: [0, 1], d: [0, 1],
    };
    const onKey = (e) => {
      const d = keys[e.key];
      if (!d) return;
      e.preventDefault();
      move(...d);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // reached the treasure -> chest opens -> says the game
  useEffect(() => {
    if (pos[0] === goal && pos[1] === goal) {
      setWon(true);
      const t1 = setTimeout(() => { setOpen(true); audio?.chime(); }, 800);
      const t2 = setTimeout(() => speak(question(game)), 1600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [pos]);

  const reply = (choice) => {
    const text = choice === "yes" ? YES : NO;
    setAnswer(text);
    speak(text);
  };

  const cell = (r, c, scale = 1) => ({
    left: `${(c / W) * 100}%`,
    top: `${(r / W) * 100}%`,
    width: `${100 / W}%`,
    height: `${100 / W}%`,
    padding: `${((1 - scale) / 2) * 100}%`,
  });

  const Pad = ({ label, dr, dc }) => (
    <button
      onClick={() => move(dr, dc)}
      aria-label={label}
      className="grid h-16 w-16 touch-manipulation place-items-center rounded-2xl bg-amber-400 text-2xl font-bold text-slate-900 shadow-md active:scale-90 sm:h-20 sm:w-20 sm:text-3xl"
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 overflow-hidden">
      <p className="absolute left-3 top-3 z-30 rounded-full bg-white/85 px-4 py-1 text-base font-bold text-slate-700 shadow sm:text-xl">
        Insel {index + 1} / {GAMES.length} — Finde den Schatz!
      </p>

      {/* SEA (fills the whole screen) */}
      <div
        className="absolute inset-0 grid place-items-center overflow-hidden"
        style={{ background: "linear-gradient(160deg,#7dd3fc,#0ea5e9 55%,#0284c7)" }}
      >
        {/* moving wave lines */}
        <div
          className="drift pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg, rgba(255,255,255,.35) 0 3px, transparent 3px 34px), repeating-linear-gradient(80deg, rgba(255,255,255,.2) 0 2px, transparent 2px 22px)",
            backgroundSize: "120px 100%, 90px 100%",
          }}
        />
        {/* birds */}
        {[["8%", "17s", "0s"], ["20%", "24s", "6s"], ["88%", "30s", "12s"]].map(([top, dur, delay], i) => (
          <span key={i} className="fly pointer-events-none absolute text-xl sm:text-2xl" style={{ top, animationDuration: dur, animationDelay: delay }}>
            🐦
          </span>
        ))}

        {/* BEACH */}
        <div
          className="foam relative grid place-items-center"
          style={{
            width: BEACH,
            height: BEACH,
            borderRadius: "46% 54% 50% 50% / 52% 48% 54% 46%",
            background: "radial-gradient(circle at 40% 35%, #fff1c1, #f6d58e 70%, #e9bd6b)",
          }}
        >
          {/* island board */}
          <div
            className={`relative overflow-hidden rounded-[30%] ${bump ? "shake" : ""}`}
            style={{
              width: BOARD,
              height: BOARD,
              display: "grid",
              gridTemplateColumns: `repeat(${W}, 1fr)`,
              gridTemplateRows: `repeat(${W}, 1fr)`,
              fontSize: `calc(${BOARD} / ${W} * 0.7)`,
            }}
          >
            {maze.flatMap((row, r) =>
              row.map((v, c) => {
                const h = (r * 7 + c * 3) % 5;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`grid place-items-center leading-none ${
                      v === 1
                        ? "bg-emerald-600 shadow-[inset_0_-3px_0_rgba(0,0,0,.18)]"
                        : (r + c) % 2
                        ? "bg-amber-100"
                        : "bg-amber-200"
                    }`}
                  >
                    {v === 1 && h === 0 && "🌴"}
                    {v === 1 && h === 1 && "🌿"}
                    {v === 0 && visited.includes(`${r}-${c}`) && (
                      <span className="block h-[20%] w-[20%] rounded-full bg-amber-500/60" />
                    )}
                  </div>
                );
              })
            )}

            {/* ship at the start */}
            <div className="bob pointer-events-none absolute" style={cell(1, 1, 1.25)}>
              <Pic src={IMAGES.ship}>
                <span className="grid h-full w-full place-items-center">⛵</span>
              </Pic>
            </div>

            {/* treasure box */}
            <div className="pointer-events-none absolute" style={cell(goal, goal, 1.1)}>
              <Chest open={open} className="h-full w-full" />
            </div>

            {/* cute pirate (slides from cell to cell) */}
            <div
              className="pointer-events-none absolute z-10"
              style={{ ...cell(pos[0], pos[1], 0.95), transition: "left .18s linear, top .18s linear" }}
            >
              <div key={steps} className="hop h-full w-full">
                <div className="h-full w-full" style={{ transform: `scaleX(${facing})` }}>
                  <Pic src={IMAGES.pirate}>
                    <PirateSVG />
                  </Pic>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D-pad */}
      <div className="absolute bottom-4 right-4 z-20 grid grid-cols-3 gap-1.5 sm:bottom-6 sm:right-6 sm:gap-2">
        <span />
        <Pad label="▲" dr={-1} dc={0} />
        <span />
        <Pad label="◀" dr={0} dc={-1} />
        <Pad label="▼" dr={1} dc={0} />
        <Pad label="▶" dr={0} dc={1} />
      </div>

      {/* Treasure opens */}
      {won && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/60 p-4">
          <div className="pop w-full max-w-md rounded-3xl bg-amber-50 p-5 text-center shadow-2xl sm:p-6">
            {!open ? (
              <Chest open={false} className="shake mx-auto h-28 w-28 sm:h-32 sm:w-32" />
            ) : (
              <>
                <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
                  <Chest open className="pop h-full w-full" />
                  <span className="pop absolute -right-6 -top-4 text-6xl sm:text-7xl">{game.emoji}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-slate-800 sm:text-3xl">{question(game)}</p>
                  <button
                    onClick={() => speak(question(game))}
                    aria-label="Vorlesen"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-300 text-xl shadow active:scale-95"
                  >
                    🔊
                  </button>
                </div>

                {!answer ? (
                  <div className="mt-4 grid gap-2">
                    <button onClick={() => reply("yes")} className="rounded-2xl bg-emerald-500 py-3 text-xl font-bold text-white shadow active:scale-95 sm:text-2xl">
                      😄 {YES}
                    </button>
                    <button onClick={() => reply("no")} className="rounded-2xl bg-slate-500 py-3 text-xl font-bold text-white shadow active:scale-95 sm:text-2xl">
                      😕 {NO}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-xl font-bold text-emerald-700 sm:text-2xl">{answer}</p>
                    <button onClick={onNext} className="mt-3 rounded-2xl bg-amber-400 px-8 py-3 text-xl font-bold text-slate-900 shadow active:scale-95 sm:text-2xl">
                      {index + 1 < GAMES.length ? "Nächste Insel" : "Fertig 🏆"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- App ---------- */
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
const canFullscreen = () =>
  typeof document !== "undefined" && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);

export default function IslandMazeGame() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [full, setFull] = useState(false);
  const [level, setLevel] = useState(0);
  const [attempt, setAttempt] = useState(0); // bump = brand-new maze

  const finished = level >= GAMES.length;

  const enterFull = () => {
    const el = document.documentElement;
    try {
      const p = el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen?.();
      p?.catch?.(() => {});
    } catch {
      /* not allowed */
    }
  };
  const toggleFull = () => {
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    else enterFull();
  };

  // keep the button in sync (also when the child presses Esc)
  useEffect(() => {
    const sync = () => setFull(!!fsElement());
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  // sound and full screen can only start after a tap (browser rule)
  const start = () => {
    if (!audio) audio = createAudio();
    setStarted(true);
    if (canFullscreen()) enterFull();
  };
  const toggleMute = () => {
    setMuted((m) => { audio?.mute(!m); return !m; });
  };
  useEffect(() => () => { audio?.stop(); audio = null; }, []);

  const roundBtn = "grid h-12 w-12 place-items-center rounded-full bg-white/90 text-xl font-bold text-slate-700 shadow active:scale-95";

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        fontFamily: "'Baloo 2', 'Trebuchet MS', system-ui, sans-serif",
        background: "linear-gradient(160deg,#7dd3fc,#0ea5e9 55%,#0284c7)",
      }}
    >
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes foam { 0%,100%{box-shadow:0 0 0 6px rgba(255,255,255,.65),0 0 0 14px rgba(255,255,255,.28)} 50%{box-shadow:0 0 0 12px rgba(255,255,255,.45),0 0 0 24px rgba(255,255,255,.12)} }
        @keyframes drift { from{background-position:0 0,0 0} to{background-position:120px 0,-90px 0} }
        @keyframes fly { 0%{left:-12%;transform:translateY(0)} 25%{transform:translateY(-10px)} 50%{transform:translateY(4px)} 75%{transform:translateY(-8px)} 100%{left:110%;transform:translateY(0)} }
        @keyframes bob { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-6%) rotate(3deg)} }
        @keyframes hop { 0%{transform:translateY(0)} 40%{transform:translateY(-22%)} 100%{transform:translateY(0)} }
        .shake{animation:shake .3s} .pop{animation:pop .35s}
        .foam{animation:foam 4s ease-in-out infinite}
        .drift{animation:drift 8s linear infinite}
        .fly{animation:fly 20s linear infinite}
        .bob{animation:bob 3s ease-in-out infinite}
        .hop{animation:hop .22s ease-out}
        @media (prefers-reduced-motion: reduce){ .shake,.pop,.foam,.drift,.fly,.bob,.hop{animation:none} }
      `}</style>

      {/* buttons in the top-right corner */}
      {started && (
        <div className="fixed right-3 top-3 z-30 flex gap-2">
          {!finished && (
            <button onClick={() => setAttempt((a) => a + 1)} aria-label="Neue Insel" className={roundBtn}>
              🔄
            </button>
          )}
          <button onClick={toggleMute} aria-label="Ton an/aus" className={roundBtn}>
            {muted ? "🔇" : "🔊"}
          </button>
          {canFullscreen() && (
            <button onClick={toggleFull} aria-label="Vollbild" className={roundBtn}>
              {full ? "✕" : "⛶"}
            </button>
          )}
        </div>
      )}

      {!started && (
        <div className="grid min-h-full place-items-center p-4">
          <div className="pop w-full max-w-md rounded-3xl bg-white/85 p-6 text-center shadow-xl">
            <h1 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">Schatzinsel</h1>
            <div className="bob mt-2 text-8xl">⛵</div>
            <p className="mt-3 text-xl text-slate-700">Segle zur Insel und finde den Schatz!</p>
            <button onClick={start} className="mt-5 rounded-2xl bg-amber-400 px-8 py-3 text-2xl font-bold text-slate-900 shadow active:scale-95">
              Los geht's!
            </button>
          </div>
        </div>
      )}

      {started && finished && (
        <div className="grid min-h-full place-items-center p-4">
          <div className="pop w-full max-w-md rounded-3xl bg-white/85 p-6 text-center shadow-xl">
            <div className="text-8xl">🏆</div>
            <p className="mt-2 text-3xl font-bold text-slate-800">Alle Schätze gefunden!</p>
            <p className="mt-2 flex flex-wrap justify-center gap-2 text-4xl">
              {GAMES.map((g) => <span key={g.id}>{g.emoji}</span>)}
            </p>
            <button
              onClick={() => { setLevel(0); setAttempt((a) => a + 1); }}
              className="mt-5 rounded-2xl bg-amber-400 px-8 py-3 text-2xl font-bold text-slate-900 shadow active:scale-95"
            >
              Nochmal spielen
            </button>
          </div>
        </div>
      )}

      {started && !finished && (
        <Island key={`${level}-${attempt}`} game={GAMES[level]} index={level} onNext={() => setLevel((l) => l + 1)} />
      )}
    </div>
  );
}