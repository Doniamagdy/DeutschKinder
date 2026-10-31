import { useEffect, useRef, useState } from "react";

import apfel from "../../../assets/apple.png";
import sonne from "../../../assets/sun.webp";
import meer from "../../../assets/sea.avif";
import baum from "../../../assets/tree.png";
import milch from "../../../assets/milk.png";
import karotte from "../../../assets/Carrot.png";
import lila from "../../../assets/lila.jpg";
import regenbogen from "../../../assets/regenbogen.png";

// كل جملة = بداية الجملة + كلمة اللون (عشان نلوّن الكلمة)
const SENTENCES = [
  { id: 1, prefix: "Der Apfel ist", color: "rot", hex: "#ef4444", image: apfel, alt: "Apfel" },
  { id: 2, prefix: "Der Baum ist", color: "grün", hex: "#22c55e", image: baum, alt: "Baum" },
  { id: 3, prefix: "Das Meer ist", color: "blau", hex: "#3b82f6", image: meer, alt: "Meer" },
  { id: 4, prefix: "Die Sonne ist", color: "gelb", hex: "#eab308", image: sonne, alt: "Sonne" },
  { id: 5, prefix: "Die Milch ist", color: "weiß", hex: "#94a3b8", image: milch, alt: "Milch" },
  { id: 6, prefix: "Die Blume ist", color: "lila", hex: "#a855f7", image: lila, alt: "Blume" },
  { id: 7, prefix: "Die Karotte ist", color: "orange", hex: "#f97316", image: karotte, alt: "Karotte" },
  { id: 8, prefix: "Der Regenbogen ist", color: "bunt", hex: null, image: regenbogen, alt: "Regenbogen" },
];

const TOTAL = SENTENCES.length;
const RAINBOW = "linear-gradient(90deg,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7)";

const sentenceOf = (s) => `${s.prefix} ${s.color}.`;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function ColorWord({ item }) {
  const style = item.hex
    ? { color: item.hex, textShadow: "0 1px 2px rgba(0,0,0,0.25)" }
    : {
        backgroundImage: RAINBOW,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      };
  return <span style={style}>{item.color}</span>;
}

export default function FarbenDragDrop() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(null);
  const [choices, setChoices] = useState([]);
  const [placed, setPlaced] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [shakeId, setShakeId] = useState(null);
  const [message, setMessage] = useState("");
  const [drag, setDrag] = useState(null); // { choice, x, y }
  const [over, setOver] = useState(false);

  const cardRef = useRef(null);
  const lockedRef = useRef(true);
  const currentRef = useRef(null);
  const orderRef = useRef([]);
  const roundRef = useRef(0);
  const timers = useRef([]);
  const cleanupDrag = useRef(null);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      cleanupDrag.current?.();
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

  const startRound = (idx) => {
    const item = orderRef.current[idx];
    const others = shuffle(SENTENCES.filter((s) => s.id !== item.id)).slice(0, 3);

    currentRef.current = item;
    roundRef.current = idx;
    lockedRef.current = true;

    setCurrent(item);
    setRound(idx);
    setChoices(shuffle([item, ...others])); // ترتيب الصور بيتغير كل جولة
    setPlaced(false);
    setWrong(0);
    setMessage("Hör zu! 👂");

    later(() => {
      speak(sentenceOf(item));
      lockedRef.current = false;
    }, 500);
  };

  const startGame = () => {
    orderRef.current = shuffle(SENTENCES); // ترتيب الجمل كمان عشوائي
    setScore(0);
    setFinished(false);
    setStarted(true);
    startRound(0);
  };

  const answer = (choice) => {
    if (lockedRef.current) return;
    const item = currentRef.current;

    if (choice.id === item.id) {
      lockedRef.current = true;
      setPlaced(true);
      setScore((s) => s + 1);
      setMessage("Super! 🎉");
      speak(sentenceOf(item));
      later(() => {
        const next = roundRef.current + 1;
        if (next >= TOTAL) {
          setFinished(true);
        } else {
          startRound(next);
        }
      }, 2600);
    } else {
      lockedRef.current = true;
      setShakeId(choice.id);
      setWrong((w) => w + 1);
      setMessage("Nochmal! 🙂");
      speak("Nochmal!");
      later(() => {
        setShakeId(null);
        lockedRef.current = false;
      }, 700);
    }
  };

  const isInside = (x, y) => {
    const r = cardRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const handlePointerDown = (e, choice) => {
    if (lockedRef.current || e.button > 0) return;

    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    setDrag({ choice, x: e.clientX, y: e.clientY });

    const move = (ev) => {
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 8) moved = true;
      setDrag({ choice, x: ev.clientX, y: ev.clientY });
      setOver(isInside(ev.clientX, ev.clientY));
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      cleanupDrag.current = null;
      setDrag(null);
      setOver(false);
    };

    const up = (ev) => {
      stop();
      if (!moved) {
        setMessage("Zieh das Bild in die Karte! 👆");
        return;
      }
      if (isInside(ev.clientX, ev.clientY)) answer(choice);
    };

    const cancel = () => stop();

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    cleanupDrag.current = stop;
  };

  // للوحة المفاتيح: Enter أو Space يحط الصورة في الكارت
  const handleKeyDown = (e, choice) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      answer(choice);
    }
  };

  const hearAgain = () => {
    if (!current || lockedRef.current) return;
    speak(sentenceOf(current));
  };

  return (
    <main dir="ltr" className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <style>{`
        @keyframes tile-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-3deg); }
          60% { transform: translateX(8px) rotate(3deg); }
        }
        @keyframes slot-pop {
          0%   { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tile-shake, .slot-pop { animation: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-4 text-center">
          <h1 className="text-xl font-extrabold text-orange-500 sm:text-2xl">
            Zieh das Bild in die Karte! 🎨
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Hör die Sätze und finde das richtige Bild.
          </p>
        </header>

        {!started || finished ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-sky-50 p-8 text-center shadow-md">
            {finished ? (
              <>
                <p className="text-3xl font-extrabold text-emerald-600">Toll gemacht! 🏆</p>
                <p className="text-xl font-bold text-stone-700">
                  ⭐ {score} / {TOTAL}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-stone-700">
                Du hörst einen Satz. Zieh das passende Bild in die Karte!
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
        ) : (
          <>
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm">
              <span className="shrink-0">
                Runde {round + 1}/{TOTAL}
              </span>
              <span className="min-w-0 truncate text-center text-orange-500">{message}</span>
              <span className="shrink-0">⭐ {score}</span>
            </div>

            {/* Picture tray */}
            <div className="mb-6 grid grid-cols-2 gap-3 rounded-3xl bg-gradient-to-br from-sky-50 via-amber-50 to-orange-50 p-3 sm:grid-cols-4 sm:gap-4 sm:p-5">
              {choices.map((c) => {
                const isDragging = drag?.choice.id === c.id;
                const isHint = wrong >= 2 && current?.id === c.id && !placed;
                const hidden = placed && current?.id === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`Bild: ${c.alt}`}
                    onPointerDown={(e) => handlePointerDown(e, c)}
                    onKeyDown={(e) => handleKeyDown(e, c)}
                    className={`tile-shake flex aspect-square touch-none select-none items-center justify-center rounded-2xl border-2 border-stone-200 bg-white p-2 shadow-md transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${
                      isDragging ? "opacity-30" : "cursor-grab hover:-translate-y-1 hover:shadow-xl"
                    } ${isHint ? "animate-pulse ring-4 ring-orange-300" : ""} ${
                      hidden ? "invisible" : ""
                    }`}
                    style={{
                      animation: shakeId === c.id ? "tile-shake 0.5s ease-in-out" : undefined,
                    }}
                  >
                    <img
                      src={c.image}
                      alt=""
                      draggable={false}
                      className="pointer-events-none h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>

            {/* Sentence card (drop zone) */}
            {current && (
              <div
                ref={cardRef}
                className={`flex flex-col items-center gap-4 rounded-3xl border-4 p-5 shadow-lg transition duration-200 sm:flex-row sm:gap-6 sm:p-8 ${
                  placed
                    ? "border-emerald-400 bg-emerald-50"
                    : over
                    ? "scale-[1.02] border-orange-400 bg-orange-50"
                    : "border-dashed border-stone-300 bg-white"
                }`}
              >
                {/* Slot */}
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 sm:h-40 sm:w-40">
                  {placed ? (
                    <img
                      src={current.image}
                      alt={current.alt}
                      className="slot-pop h-full w-full object-contain p-2"
                      style={{ animation: "slot-pop 0.5s ease-out" }}
                    />
                  ) : (
                    <span className="text-5xl text-stone-300">?</span>
                  )}
                </div>

                {/* Sentence */}
                <p className="min-w-0 flex-1 break-words text-center text-3xl font-extrabold leading-snug text-stone-800 sm:text-left sm:text-4xl lg:text-5xl">
                  {current.prefix} <ColorWord item={current} />.
                </p>

                {/* Listen button */}
                <button
                  type="button"
                  onClick={hearAgain}
                  aria-label="Satz noch einmal hören"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-400 text-2xl text-white shadow-md transition hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                >
                  🔊
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dragged picture following the finger / mouse */}
      {drag && (
        <div
          className="pointer-events-none fixed z-50 h-24 w-24 rounded-2xl border-2 border-orange-300 bg-white p-2 shadow-2xl sm:h-28 sm:w-28"
          style={{
            left: drag.x,
            top: drag.y,
            transform: "translate(-50%, -50%) scale(1.1) rotate(4deg)",
          }}
        >
          <img
            src={drag.choice.image}
            alt=""
            draggable={false}
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </main>
  );
}
