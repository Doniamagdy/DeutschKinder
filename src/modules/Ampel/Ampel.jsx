
import { useCallback, useEffect, useRef, useState } from "react";

const STATES = {
  red: {
    title: "Stopp! Ruhe bitte.",
    sub: "Wir sind ganz still.",
    face: "#ffb4a8",
    page: "bg-red-100",
    lamp: "bg-red-500 shadow-[0_0_35px_#ef4444]",
    key: "1",
  },
  yellow: {
    title: "Leise sprechen.",
    sub: "Wir flüstern.",
    face: "#ffe58a",
    page: "bg-yellow-100",
    lamp: "bg-yellow-400 shadow-[0_0_35px_#facc15]",
    key: "2",
  },
  green: {
    title: "Wir sprechen.",
    sub: "Hand hoch, dann sprechen.",
    face: "#a8e6a1",
    page: "bg-green-100",
    lamp: "bg-green-500 shadow-[0_0_35px_#22c55e]",
    key: "3",
  },
};

const INK = "#5a2b22";

function Face({ mood }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-[min(38vw,38vh)] h-auto"
      aria-hidden="true"
    >
      <circle
        cx="100"
        cy="100"
        r="86"
        fill={STATES[mood].face}
        stroke={INK}
        strokeWidth="5"
      />

      <circle cx="72" cy="104" r="9" fill={INK} />
      <circle cx="128" cy="104" r="9" fill={INK} />

      {mood === "red" && (
        <>
          <path
            d="M60 82 Q74 76 88 82 M112 82 Q126 76 140 82"
            stroke={INK}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M84 140 Q100 146 116 140"
            stroke={INK}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          <rect
            x="94"
            y="118"
            width="14"
            height="52"
            rx="7"
            fill="#f2c9a0"
            stroke={INK}
            strokeWidth="3"
          />
        </>
      )}

      {mood === "yellow" && (
        <>
          <path
            d="M60 82 L88 82 M140 82 L112 82"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="100" cy="140" rx="9" ry="7" fill={INK} />
        </>
      )}

      {mood === "green" && (
        <>
          <path
            d="M60 80 Q74 70 88 80 M140 80 Q126 70 112 80"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          <path d="M70 124 Q100 168 130 124 Z" fill={INK} />

          <path
            d="M82 136 Q100 150 118 136 Q100 142 82 136Z"
            fill="#fff"
          />
        </>
      )}
    </svg>
  );
}

export default function Ampel() {
  const [mood, setMood] = useState("green");
  const [sound, setSound] = useState(true);

  const ctxRef = useRef(null);
  const timers = useRef([]);

  // One short tick
  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 1400;

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.06
    );

    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }, []);

  // Three ticks
  const playTicks = useCallback(() => {
    timers.current.forEach(clearTimeout);

    timers.current = [0, 1000, 2000].map((ms) =>
      setTimeout(tick, ms)
    );
  }, [tick]);

  // Choose mood
  const choose = useCallback(
    (name) => {
      if (!ctxRef.current) {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext;

        if (AudioContext) {
          ctxRef.current = new AudioContext();
        }
      }

      if (ctxRef.current?.state === "suspended") {
        ctxRef.current.resume();
      }

      timers.current.forEach(clearTimeout);

      setMood(name);

      if (name === "red" && sound) {
        playTicks();
      }
    },
    [sound, playTicks]
  );

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const found = Object.entries(STATES).find(
        ([, s]) => s.key === e.key
      );

      if (found) {
        choose(found[0]);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [choose]);

  // Clear timers
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const s = STATES[mood];

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-2 py-3 sm:p-3 transition-colors duration-300 ${s.page}`}
    >
      {/* Sound Button */}
      <button
        onClick={() => setSound((v) => !v)}
        aria-label={sound ? "Ton aus" : "Ton an"}
        className="fixed top-2 right-3 z-10 text-2xl sm:text-3xl"
      >
        {sound ? "🔊" : "🔇"}
      </button>

      <main className="flex w-full max-w-6xl flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-10">

        {/* Traffic Light */}
        <div
          role="group"
          aria-label="Ampel"
          className="flex shrink-0 flex-col gap-2 rounded-[25px] bg-slate-700 p-2 sm:gap-3 sm:p-3"
        >
          {Object.entries(STATES).map(([name, st]) => (
            <button
              key={name}
              onClick={() => choose(name)}
              aria-label={st.title}
              className={`h-[min(20vw,19vh)] w-[min(20vw,19vh)] min-h-[55px] min-w-[55px] max-h-[185px] max-w-[185px] rounded-full transition-all duration-200 active:scale-95 focus-visible:outline-4 focus-visible:outline-white ${
                mood === name ? st.lamp : "bg-slate-500"
              }`}
            />
          ))}
        </div>

        {/* Face + Text */}
        <div
          className="min-w-0 flex-1 text-center"
          aria-live="polite"
        >
          <div className="flex justify-center">
            <Face mood={mood} />
          </div>

          <h1 className="mt-1 text-[clamp(1.2rem,4vw,3.5rem)] font-extrabold leading-tight text-stone-800">
            {s.title}
          </h1>

          <p className="mt-1 text-[clamp(0.85rem,2.5vw,1.8rem)] text-stone-600">
            {s.sub}
          </p>
        </div>

      </main>
    </div>
  );
}
