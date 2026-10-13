import { useState } from "react";
import Swal from "sweetalert2";

import "./VerstecktSpiel.css";

import roomBg from "../../../assets/girlroom.jpeg";

import Lama from "../../../assets/lama.webp"
import Igel from "../../../assets/igel.jpg"
import Hase from "../../../assets/hase.avif"
import Puma from "../../../assets/puma.png"
import Esel from "../../../assets/esel.png"

const animals = [
  { name: "Puma", article: "der", image: Puma, emoji: "🐆" },
  { name: "Esel", article: "der", image: Esel, emoji: "🐴" },
  { name: "Igel", article: "der", image: Igel, emoji: "🦔" },
  { name: "Lama", article: "das", image: Lama, emoji: "🦙" },
  { name: "Hase", article: "der", image: Hase, emoji: "🐰" },
];

// أماكن الاستخباية (نسب من صورة الأوضة) - عدّليهم على صورتك
const spots = [
  { left: 6, top: 62, size: 9 },
  { left: 20, top: 40, size: 8 },
  { left: 33, top: 70, size: 9 },
  { left: 45, top: 25, size: 8 },
  { left: 57, top: 60, size: 9 },
  { left: 68, top: 38, size: 8 },
  { left: 80, top: 68, size: 9 },
  { left: 88, top: 30, size: 8 },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// الجولة 1-2 = 3 حيوانات، 3-4 = 4، من 5 = كلهم
const countForRound = (round) =>
  Math.min(3 + Math.floor((round - 1) / 2), animals.length);

// بيختار حيوانات مختلفة عن الجولة اللي فاتت وأماكن عشوائية
const buildRound = (round, previousNames) => {
  const count = countForRound(round);

  const fresh = shuffle(animals.filter((a) => !previousNames.includes(a.name)));
  const old = shuffle(animals.filter((a) => previousNames.includes(a.name)));
  const chosen = [...fresh, ...old].slice(0, count);

  const randomSpots = shuffle(spots).slice(0, count);

  return chosen.map((animal, i) => ({ ...animal, spot: randomSpots[i] }));
};

function VerstecktSpiel() {
  const [round, setRound] = useState(1);
  const [targets, setTargets] = useState(() => buildRound(1, []));
  const [found, setFound] = useState([]);
  const [stars, setStars] = useState(0);

  const startRound = (nextRound) => {
    const previousNames = targets.map((t) => t.name);
    setRound(nextRound);
    setTargets(buildRound(nextRound, previousNames));
    setFound([]);
  };

  const handleFound = (animal) => {
    if (found.includes(animal.name)) return;

    const newFound = [...found, animal.name];
    setFound(newFound);
    setStars((s) => s + 1);

    // آخر حيوان في الجولة
    if (newFound.length === targets.length) {
      setTimeout(() => {
        Swal.fire({
          title: "Super gemacht! 🎉",
          text: `Du hast alle Tiere gefunden!`,
          icon: "success",
          confirmButtonText: "Nächste Runde ⭐",
          confirmButtonColor: "#f59e0b",
        }).then(() => startRound(round + 1));
      }, 400);
      return;
    }

    // رسالة صغيرة من غير ما توقف اللعبة
    Swal.fire({
      toast: true,
      position: "top",
      title: `${animal.emoji} ${animal.article} ${animal.name}`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="game-screen">
      <div className="toy-room">
        <img className="room-background" src={roomBg} alt="Zimmer" />

        {/* ===== القائمة فوق ===== */}
        <div className="hud">
          <div className="hud-title">Finde die Tiere!</div>

          <div className="hud-list">
            {targets.map((t) => (
              <span
                key={t.name}
                className={`hud-chip ${found.includes(t.name) ? "done" : ""}`}
              >
                {t.emoji} {t.name}
              </span>
            ))}
          </div>

          <div className="hud-stars">
            Runde {round} · ⭐ {stars}
          </div>
        </div>

        {/* ===== الحيوانات المستخبية ===== */}
        {targets.map((t) => {
          if (found.includes(t.name)) return null;

          return (
            <button
              key={`${round}-${t.name}`}
              type="button"
              className="hidden-animal"
              style={{
                left: `${t.spot.left}%`,
                top: `${t.spot.top}%`,
                width: `${t.spot.size}%`,
              }}
              onClick={() => handleFound(t)}
              aria-label={t.name}
            >
              <img src={t.image} alt={t.name} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VerstecktSpiel;