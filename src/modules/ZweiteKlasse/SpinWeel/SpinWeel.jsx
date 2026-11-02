import { useMemo, useState } from "react";

/* ---------- Data ---------- */
const YES = "Au ja, das macht Spaß!";
const NO = "Nein, keine Lust.";

const GAMES = [
  { id: "karten", emoji: "🃏", words: ["Spielen", "wir", "Karten"] },
  { id: "federball", emoji: "🏸", words: ["Spielen", "wir", "Federball"] },
  { id: "piraten", emoji: "🏴‍☠️", words: ["Spielen", "wir", "Piraten"] },
  { id: "mikado", emoji: "🥢", words: ["Spielen", "wir", "Mikado"] },
  { id: "verstecken", emoji: "🙈", words: ["Spielen", "wir", "Verstecken"] },
  { id: "ball", emoji: "⚽", words: ["Spielen", "wir", "mit", "dem", "Ball"] },
];

const SEG_COLORS = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5", "#f78c3a"];
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

/* ---------- Word builder (tap the words in order) ---------- */
function WordBuilder({ words, onDone }) {
  const bank = useMemo(
    () => words.map((w, i) => ({ w, i })).sort(() => Math.random() - 0.5),
    [words]
  );
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(null);

  const pick = (item) => {
    if (placed.some((p) => p.i === item.i)) return;
    if (item.w === words[placed.length]) {
      const next = [...placed, item];
      setPlaced(next);
      if (next.length === words.length) {
        speak(words.join(" ") + "?");
        setTimeout(onDone, 1200);
      }
    } else {
      setWrong(item.i);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/70 p-2 sm:gap-2 sm:p-3">
        {words.map((_, i) => (
          <div
            key={i}
            className={`grid h-11 min-w-[3.5rem] place-items-center rounded-xl border-4 border-dashed px-2 text-lg font-bold sm:h-14 sm:min-w-[4.5rem] sm:px-3 sm:text-2xl ${
              placed[i] ? "border-emerald-500 bg-emerald-100 text-emerald-800" : "border-slate-300 text-transparent"
            }`}
          >
            {placed[i]?.w ?? "…"}
          </div>
        ))}
        <span className="text-3xl font-bold text-slate-700 sm:text-4xl">?</span>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
        {bank.map((item) => {
          const used = placed.some((p) => p.i === item.i);
          return (
            <button
              key={item.i}
              disabled={used}
              onClick={() => pick(item)}
              className={`rounded-2xl px-4 py-2 text-xl font-bold shadow-md transition active:scale-95 sm:px-5 sm:py-3 sm:text-2xl ${
                used ? "bg-slate-200 text-slate-300" : "bg-sky-500 text-white"
              } ${wrong === item.i ? "shake bg-rose-500" : ""}`}
            >
              {item.w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- The wheel ---------- */
const pt = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return [100 + r * Math.sin(a), 100 - r * Math.cos(a)];
};

function Wheel({ rot, onSpin, disabled }) {
  return (
    <div
      className="relative mx-auto aspect-square"
      /* fits width AND height of small landscape phones, max 26rem */
      style={{ width: "min(88vw, 55vh, 26rem)" }}
    >
      <div className="absolute left-1/2 top-[-4%] z-10 -translate-x-1/2 text-3xl sm:text-4xl">🔻</div>
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full drop-shadow-xl"
        style={{ transform: `rotate(${rot}deg)`, transition: "transform 3s cubic-bezier(.15,.7,.15,1)" }}
      >
        {GAMES.map((g, i) => {
          const [x0, y0] = pt(i * 60 - 30, 96);
          const [x1, y1] = pt(i * 60 + 30, 96);
          const [ex, ey] = pt(i * 60, 62);
          return (
            <g key={g.id}>
              <path d={`M100 100 L${x0} ${y0} A96 96 0 0 1 ${x1} ${y1} Z`} fill={SEG_COLORS[i]} stroke="#fff" strokeWidth="3" />
              <text x={ex} y={ey} fontSize="30" textAnchor="middle" dominantBaseline="central">
                {g.emoji}
              </text>
            </g>
          );
        })}
      </svg>
      <button
        onClick={onSpin}
        disabled={disabled}
        className="absolute left-1/2 top-1/2 grid aspect-square w-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white shadow-lg active:scale-95 disabled:opacity-60 sm:text-lg"
      >
        Dreh!
      </button>
    </div>
  );
}

/* ---------- Main component ---------- */
export default function SpinWheel() {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [picked, setPicked] = useState(null);
  const [built, setBuilt] = useState(false);
  const [friend, setFriend] = useState("yes");
  const [stickers, setStickers] = useState([]);
  const game = picked !== null ? GAMES[picked] : null;

  const spin = () => {
    if (spinning || game) return;
    const left = GAMES.map((_, i) => i).filter((i) => !stickers.includes(GAMES[i].id));
    const pool = left.length ? left : GAMES.map((_, i) => i);
    const k = pool[Math.floor(Math.random() * pool.length)];
    const target = (360 - k * 60) % 360;
    setRot(rot + 360 * 4 + ((target - (rot % 360) + 360) % 360));
    setSpinning(true);
    setTimeout(() => {
      setPicked(k);
      setSpinning(false);
    }, 3100);
  };

  const finish = () => {
    const m = Math.random() < 0.5 ? "yes" : "no";
    setFriend(m);
    setBuilt(true);
    speak(m === "yes" ? YES : NO);
    setStickers((s) => (s.includes(game.id) ? s : [...s, game.id]));
  };

  const again = () => {
    setPicked(null);
    setBuilt(false);
  };

  return (
    <div
      className="min-h-[100dvh] bg-amber-100 px-3 py-4 sm:px-6 sm:py-8"
      style={{ fontFamily: "'Baloo 2', 'Trebuchet MS', system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 100%{transform:scale(1);opacity:1} }
        .shake{animation:shake .4s} .pop{animation:pop .35s}
        @media (prefers-reduced-motion: reduce){ .shake,.pop{animation:none} }
      `}</style>

      <div className="mx-auto w-full max-w-xl text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-slate-800 sm:text-5xl">Spielen wir …?</h1>

        {/* Sticker album */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl bg-white/80 px-3 py-2 text-base font-bold text-slate-800 sm:text-xl">
          <span>Sticker-Album:</span>
          {GAMES.map((g) => (
            <span key={g.id} className={`text-2xl sm:text-3xl ${stickers.includes(g.id) ? "" : "opacity-20 grayscale"}`}>
              {g.emoji}
            </span>
          ))}
        </div>

        {!game && (
          <>
            <Wheel rot={rot} onSpin={spin} disabled={spinning} />
            <p className="mt-4 text-lg font-bold text-slate-700 sm:text-xl">
              {stickers.length === GAMES.length ? "🏆 Alle Sticker gesammelt!" : "Dreh das Rad!"}
            </p>
          </>
        )}

        {game && !built && (
          <div className="pop">
            <div className="text-6xl sm:text-7xl">{game.emoji}</div>
            <p className="my-3 text-xl font-bold text-slate-800 sm:text-2xl">Baue die Frage:</p>
            <WordBuilder key={game.id + stickers.length} words={game.words} onDone={finish} />
          </div>
        )}

        {game && built && (
          <div className="pop rounded-3xl bg-white/80 p-4 sm:p-5">
            <div className="text-6xl sm:text-7xl">{game.emoji}</div>
            <p className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">{question(game)}</p>
            <div className="mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
              <span className="text-5xl">{friend === "yes" ? "😄" : "😕"}</span>
              <span className="rounded-2xl bg-white px-4 py-2 text-xl font-bold text-slate-800 shadow sm:text-2xl">
                {friend === "yes" ? YES : NO}
              </span>
            </div>
            <p className="mt-3 text-lg text-emerald-700 sm:text-xl">⭐ Neuer Sticker!</p>
            <button
              onClick={again}
              className="mt-4 rounded-2xl bg-amber-400 px-6 py-3 text-xl font-bold text-slate-900 shadow active:scale-95 sm:px-8 sm:text-2xl"
            >
              Nochmal drehen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}