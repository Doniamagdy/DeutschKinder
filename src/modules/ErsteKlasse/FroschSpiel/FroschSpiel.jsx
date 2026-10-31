import { useEffect, useRef, useState } from "react";

const COLORS = [
  { id: "rot", word: "rot", hex: "#ef4444" },
  { id: "blau", word: "blau", hex: "#3b82f6" },
  { id: "gelb", word: "gelb", hex: "#eab308" },
  { id: "orange", word: "orange", hex: "#f97316" },
  { id: "gruen", word: "grün", hex: "#22c55e" },
  { id: "weiss", word: "weiß", hex: "#f8fafc", light: true },
  { id: "lila", word: "lila", hex: "#a855f7" },
];

// مواقع الورق في البركة (نسبة مئوية من العرض والارتفاع)
const POSITIONS = [
  { x: 16, y: 26 },
  { x: 50, y: 20 },
  { x: 84, y: 26 },
  { x: 28, y: 54 },
  { x: 72, y: 54 },
  { x: 13, y: 78 },
  { x: 87, y: 78 },
];

const LOG = { x: 50, y: 90 }; // مكان بداية الضفدع
const TOTAL_ROUNDS = 8;

const MUSHROOMS = [
  { x: 9, w: 14, top: -3, cap: "#6d5dfc", stem: "#c7c2ff" },
  { x: 31, w: 9, top: 0, cap: "#f97316", stem: "#fed7aa" },
  { x: 64, w: 16, top: -4, cap: "#a855f7", stem: "#e9d5ff" },
  { x: 90, w: 10, top: 2, cap: "#fb923c", stem: "#fed7aa" },
];

const FIREFLIES = [
  { x: 6, y: 52, d: 3.2, s: 0 },
  { x: 14, y: 78, d: 4.1, s: 1.2 },
  { x: 24, y: 40, d: 3.6, s: 0.6 },
  { x: 38, y: 48, d: 4.4, s: 2 },
  { x: 44, y: 76, d: 3.8, s: 0.3 },
  { x: 57, y: 44, d: 3.4, s: 1.6 },
  { x: 62, y: 80, d: 4.2, s: 0.9 },
  { x: 76, y: 46, d: 3.9, s: 2.4 },
  { x: 88, y: 66, d: 3.5, s: 0.4 },
  { x: 94, y: 40, d: 4.3, s: 1.8 },
  { x: 20, y: 14, d: 3.7, s: 1 },
  { x: 78, y: 12, d: 4, s: 2.2 },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------- ورقة الشجر (شكل مجسّم) ---------- */
function LilyPad({ id, hex, light }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className="h-full w-full overflow-visible drop-shadow-[0_6px_6px_rgba(0,0,0,0.45)]"
      aria-hidden="true"
    >
      <defs>
        <mask id={`cut-${id}`}>
          <rect x="-10" y="-10" width="140" height="100" fill="white" />
          <polygon points="60,40 135,22 135,58" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#cut-${id})`}>
        {/* السُمك */}
        <ellipse cx="60" cy="49" rx="56" ry="28" fill={hex} />
        <ellipse cx="60" cy="49" rx="56" ry="28" fill="#000" opacity="0.4" />
        {/* الوجه العلوي */}
        <ellipse cx="60" cy="40" rx="56" ry="28" fill={hex} />
        <ellipse cx="60" cy="40" rx="56" ry="28" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
        {/* عروق الورقة */}
        <g stroke={light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.35)"} strokeWidth="2" strokeLinecap="round">
          <line x1="60" y1="40" x2="14" y2="30" />
          <line x1="60" y1="40" x2="22" y2="58" />
          <line x1="60" y1="40" x2="60" y2="66" />
          <line x1="60" y1="40" x2="40" y2="16" />
          <line x1="60" y1="40" x2="84" y2="16" />
          <line x1="60" y1="40" x2="104" y2="30" />
        </g>
        <ellipse cx="38" cy="26" rx="18" ry="6" fill="#fff" opacity="0.22" />
      </g>
    </svg>
  );
}

/* ---------- الضفدع ---------- */
function Frog() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
      {/* رجلين خلفية */}
      <ellipse cx="18" cy="84" rx="15" ry="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
      <ellipse cx="82" cy="84" rx="15" ry="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
      {/* جسم */}
      <ellipse cx="50" cy="66" rx="32" ry="26" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <ellipse cx="50" cy="74" rx="20" ry="16" fill="#fde68a" />
      {/* أيدي أمامية */}
      <ellipse cx="32" cy="90" rx="10" ry="6" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <ellipse cx="68" cy="90" rx="10" ry="6" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      {/* راس */}
      <ellipse cx="50" cy="46" rx="34" ry="24" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      {/* عيون */}
      <circle cx="33" cy="30" r="14" fill="#fff" stroke="#15803d" strokeWidth="2" />
      <circle cx="67" cy="30" r="14" fill="#fff" stroke="#15803d" strokeWidth="2" />
      <circle cx="35" cy="32" r="7" fill="#1f2937" />
      <circle cx="65" cy="32" r="7" fill="#1f2937" />
      <circle cx="37" cy="29" r="2.5" fill="#fff" />
      <circle cx="67" cy="29" r="2.5" fill="#fff" />
      {/* خدود */}
      <circle cx="24" cy="52" r="5" fill="#fb7185" opacity="0.55" />
      <circle cx="76" cy="52" r="5" fill="#fb7185" opacity="0.55" />
      {/* فم */}
      <path d="M32 52 Q50 74 68 52 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" strokeLinejoin="round" />
      <path d="M40 62 Q50 68 60 62 Q50 58 40 62Z" fill="#fb7185" />
    </svg>
  );
}

/* ---------- فطر مضيء ---------- */
function Mushroom({ cap, stem }) {
  return (
    <svg
      viewBox="0 0 60 80"
      className="h-full w-full overflow-visible"
      style={{ filter: `drop-shadow(0 0 12px ${cap})` }}
      aria-hidden="true"
    >
      <path d="M22 38 Q21 68 15 78 L45 78 Q39 68 38 38 Z" fill={stem} opacity="0.85" />
      <path d="M3 38 Q3 3 30 3 Q57 3 57 38 Q30 46 3 38 Z" fill={cap} />
      <circle cx="18" cy="22" r="4" fill="#fff" opacity="0.35" />
      <circle cx="36" cy="14" r="3" fill="#fff" opacity="0.35" />
      <circle cx="44" cy="28" r="4" fill="#fff" opacity="0.3" />
    </svg>
  );
}

/* ---------- نبات القصب ---------- */
function Reeds() {
  return (
    <svg viewBox="0 0 60 100" className="h-full w-full" aria-hidden="true">
      <path d="M8 100 Q4 50 20 6 Q18 55 20 100Z" fill="#14532d" />
      <path d="M22 100 Q22 56 38 22 Q32 62 34 100Z" fill="#166534" />
      <path d="M36 100 Q40 62 54 40 Q46 70 48 100Z" fill="#15803d" />
    </svg>
  );
}

export default function FroschSpiel() {
  const [started, setStarted] = useState(false);
  const [pads, setPads] = useState([]); // [{ color, pos }]
  const [target, setTarget] = useState(null);
  const [frogPos, setFrogPos] = useState(LOG);
  const [hopKey, setHopKey] = useState(0);
  const [wobble, setWobble] = useState(false);
  const [busy, setBusy] = useState(true);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  const timers = useRef([]);
  const lastTarget = useRef(null);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const voices = synth.getVoices();
    const germanVoice =
      voices.find((v) => v.lang === "de-DE") ||
      voices.find((v) => v.lang.startsWith("de"));
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.85;
    if (germanVoice) u.voice = germanVoice;
    synth.speak(u);
  };

  const jumpTo = (pos) => {
    setFrogPos(pos);
    setHopKey((k) => k + 1);
  };

  const startRound = (roundNumber) => {
    const positions = shuffle(POSITIONS);
    const newPads = shuffle(COLORS).map((color, i) => ({
      color,
      pos: positions[i],
    }));

    let next;
    do {
      next = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (next.id === lastTarget.current);
    lastTarget.current = next.id;

    setBusy(true);
    setWrongCount(0);
    setMessage("Hör gut zu! 👂");
    jumpTo(LOG);
    setPads(newPads);
    setTarget(next);
    setRound(roundNumber);

    later(() => {
      speak(next.word);
      setBusy(false);
    }, 900);
  };

  const startGame = () => {
    setStarted(true);
    setFinished(false);
    setScore(0);
    lastTarget.current = null;
    startRound(1);
  };

  const handlePadClick = (pad) => {
    if (busy || !target) return;
    setBusy(true);
    const previousPos = frogPos;
    jumpTo(pad.pos);

    const correct = pad.color.id === target.id;

    later(() => {
      if (correct) {
        setScore((s) => s + 1);
        setMessage("Super! 🎉");
        speak("Super!");
        later(() => {
          if (round >= TOTAL_ROUNDS) {
            setFinished(true);
            setBusy(true);
          } else {
            startRound(round + 1);
          }
        }, 1400);
      } else {
        setWobble(true);
        setWrongCount((c) => c + 1);
        setMessage("Nochmal! 🙂");
        speak("Nochmal!");
        later(() => {
          setWobble(false);
          jumpTo(previousPos);
          later(() => {
            speak(target.word);
            setBusy(false);
          }, 1100);
        }, 900);
      }
    }, 750);
  };

  const hearAgain = () => {
    if (busy || !target) return;
    speak(target.word);
  };

  return (
    <main dir="ltr" className="min-h-screen w-full py-6 sm:py-8">
      <style>{`
        @keyframes frog-hop {
          0%   { transform: translateY(0) scale(1, 1); }
          20%  { transform: translateY(0) scale(1.12, 0.88); }
          55%  { transform: translateY(-45%) scale(0.95, 1.08); }
          100% { transform: translateY(0) scale(1, 1); }
        }
        @keyframes frog-wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-14deg); }
          75% { transform: rotate(14deg); }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0.15; transform: translate(0, 0) scale(0.8); }
          50% { opacity: 1; transform: translate(6px, -8px) scale(1.2); }
        }
        @keyframes ripple {
          0%   { opacity: 0.8; transform: translate(-50%, -50%) scale(0.3); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
        }
        @keyframes ripple-idle {
          0%   { opacity: 0.5; transform: scale(0.6); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .frog-anim, .frog-move, .firefly, .ripple, .ripple-idle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="w-full">
        {/* Header */}
        <header className="mb-4 px-4 text-center">
          <h1 className="text-xl font-extrabold text-emerald-700 sm:text-2xl">
            Der Frosch springt! 🐸
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Hör zu und tippe auf das richtige Blatt.
          </p>
        </header>

        {/* Score bar */}
        {started && !finished && (
          <div className="mx-4 mb-3 flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm sm:mx-6">
            <span className="shrink-0">
              Runde {round}/{TOTAL_ROUNDS}
            </span>
            <span className="min-w-0 truncate text-center text-orange-500">
              {message}
            </span>
            <span className="shrink-0">⭐ {score}</span>
          </div>
        )}

        {/* ===== Pond ===== */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b md:aspect-[16/9] md:max-h-[85vh] sm:rounded-3xl from-[#06222e] via-[#0a4c63] to-[#0b7285] shadow-xl ring-2 ring-teal-900/40">
          {/* ضوء الماء */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(34,211,238,0.35),transparent_60%)]" />

          {/* فطر مضيء في الخلفية */}
          {MUSHROOMS.map((m, i) => (
            <div
              key={i}
              className="pointer-events-none absolute -translate-x-1/2 opacity-90"
              style={{
                left: `${m.x}%`,
                top: `${m.top}%`,
                width: `${m.w}%`,
                aspectRatio: "60 / 80",
              }}
            >
              <Mushroom cap={m.cap} stem={m.stem} />
            </div>
          ))}

          {/* قصب على الجوانب */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-[42%] w-[12%] opacity-90">
            <Reeds />
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 h-[42%] w-[12%] -scale-x-100 opacity-90">
            <Reeds />
          </div>

          {/* دوائر ماء هادية */}
          {[
            { x: 50, y: 48, w: 18 },
            { x: 12, y: 50, w: 10 },
            { x: 88, y: 52, w: 12 },
          ].map((r, i) => (
            <div
              key={i}
              className="ripple-idle pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-cyan-100/60"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: `${r.w}%`,
                height: `${r.w * 0.4}%`,
                animation: `ripple-idle 3.5s ease-out ${i * 1.1}s infinite`,
              }}
            />
          ))}

          {/* يراعات */}
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="firefly pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_3px_rgba(253,224,71,0.8)]"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                animation: `firefly ${f.d}s ease-in-out ${f.s}s infinite`,
              }}
            />
          ))}

          {/* جذع الشجرة (البداية) */}
          <div
            className="absolute h-[11%] w-[28%] md:h-[13%] md:w-[22%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-gradient-to-b from-[#a16a35] via-[#7c4a1e] to-[#4a2c12] shadow-[0_6px_8px_rgba(0,0,0,0.5)]"
            style={{ left: `${LOG.x}%`, top: `${LOG.y}%` }}
          >
            <div className="absolute right-0 top-0 h-full w-[18%] rounded-full bg-[#d9a066] ring-2 ring-[#5b3a1a]" />
            <div className="absolute left-[12%] top-[30%] h-[10%] w-[50%] rounded-full bg-black/15" />
            <div className="absolute left-[25%] top-[60%] h-[10%] w-[40%] rounded-full bg-black/15" />
          </div>

          {/* دايرة ماء مكان نزول الضفدع */}
          {hopKey > 0 && (
            <span
              key={`r-${hopKey}`}
              className="ripple pointer-events-none absolute rounded-[50%] border-2 border-white/80"
              style={{
                left: `${frogPos.x}%`,
                top: `${frogPos.y + 3}%`,
                width: "22%",
                height: "9%",
                animation: "ripple 0.9s ease-out 0.55s both",
              }}
            />
          )}

          {/* أوراق الشجر */}
          {pads.map((pad) => {
            const showHint = wrongCount >= 2 && target?.id === pad.color.id;
            return (
              <button
                key={pad.color.id}
                type="button"
                onClick={() => handlePadClick(pad)}
                disabled={busy}
                aria-label={`Blatt ${pad.color.word}`}
                className={`absolute w-[17%] md:w-[14%] -translate-x-1/2 -translate-y-1/2 rounded-full transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white enabled:hover:scale-110 ${
                  showHint ? "animate-pulse" : ""
                }`}
                style={{
                  left: `${pad.pos.x}%`,
                  top: `${pad.pos.y}%`,
                  aspectRatio: "120 / 80",
                }}
              >
                <LilyPad id={pad.color.id} hex={pad.color.hex} light={pad.color.light} />
              </button>
            );
          })}

          {/* الضفدع */}
          <div
            className="frog-move pointer-events-none absolute z-10 w-[15%] md:w-[10%]"
            style={{
              left: `${frogPos.x}%`,
              top: `${frogPos.y}%`,
              aspectRatio: "1 / 1",
              transform: "translate(-50%, -68%)",
              transition: "left 700ms ease-in-out, top 700ms ease-in-out",
            }}
          >
            <div
              key={hopKey}
              className="frog-anim h-full w-full select-none"
              style={{
                animation: wobble
                  ? "frog-wobble 0.6s ease-in-out"
                  : hopKey > 0
                  ? "frog-hop 0.7s ease-in-out"
                  : undefined,
              }}
            >
              <Frog />
            </div>
          </div>

          {/* شاشة البداية / النهاية */}
          {(!started || finished) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-900/60 p-4 text-center backdrop-blur-sm">
              {finished ? (
                <>
                  <p className="text-2xl font-extrabold text-yellow-300">
                    Toll gemacht! 🏆
                  </p>
                  <p className="text-lg font-bold text-white">
                    ⭐ {score} / {TOTAL_ROUNDS}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-white">
                  Der Frosch hört eine Farbe und springt!
                </p>
              )}
              <button
                type="button"
                onClick={startGame}
                className="min-h-11 rounded-xl bg-orange-400 px-6 py-2 text-base font-bold text-white shadow-lg transition hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
              >
                {finished ? "Nochmal spielen" : "Spiel starten"}
              </button>
            </div>
          )}
        </div>

        {/* Hear again */}
        {started && !finished && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={hearAgain}
              disabled={busy}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:opacity-50"
            >
              🔊 Nochmal hören
            </button>
          </div>
        )}
      </div>
    </main>
  );
}