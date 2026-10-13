import { useState } from "react";
import Swal from "sweetalert2";

import "./Gedächtnisspiel.css";

import Pizza from "../../../assets/Pizza.png";
import Eis from "../../../assets/ice-cream.webp";
import Schokolade from "../../../assets/chocholate.webp";
import Brot from "../../../assets/bread.jpg";
import Kaese from "../../../assets/cheese.avif";
import Salat from "../../../assets/salad.jpg";
import Joghurt from "../../../assets/yogurt.png";
import Kuchen from "../../../assets/kuchen.avif";

const products = [
  { name: "Pizza", image: Pizza },
  { name: "Eis", image: Eis },
  { name: "Schokolade", image: Schokolade },
  { name: "Brot", image: Brot },
  { name: "Käse", image: Kaese },
  { name: "Salat", image: Salat },
  { name: "Joghurt", image: Joghurt },
  { name: "Kuchen", image: Kuchen },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// الجولة 1 = 3 أزواج، 2 = 4، 3 = 5، من 4 وطالع = 6
const pairsForRound = (round) => Math.min(2 + round, 6);

// عدد الأعمدة حسب عدد الكروت
const columnsFor = (count) => ({ 6: 3, 8: 4, 10: 5, 12: 4 }[count] || 4);

// بيختار كلمات مختلفة عن الجولة اللي فاتت (لو متاح) وبيخلط الأماكن
const buildRound = (round, previousNames) => {
  const count = pairsForRound(round);

  const fresh = shuffle(products.filter((p) => !previousNames.includes(p.name)));
  const old = shuffle(products.filter((p) => previousNames.includes(p.name)));
  const chosen = [...fresh, ...old].slice(0, count);

  const cards = chosen.flatMap((p) => [
    { uid: `${p.name}-image`, name: p.name, image: p.image, type: "image" },
    { uid: `${p.name}-word`, name: p.name, type: "word" },
  ]);

  return shuffle(cards);
};

const speak = (text) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

function Gedächtnisspiel() {
  const [round, setRound] = useState(1);
  const [cards, setCards] = useState(() => buildRound(1, []));
  const [flipped, setFlipped] = useState([]); // uids
  const [matched, setMatched] = useState([]); // names
  const [moves, setMoves] = useState(0);
  const [stars, setStars] = useState(0);
  const [locked, setLocked] = useState(false);

  const pairCount = cards.length / 2;

  const startRound = (nextRound) => {
    const previousNames = cards.map((c) => c.name);
    setRound(nextRound);
    setCards(buildRound(nextRound, previousNames));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  };

  const handleCardClick = (card) => {
    if (
      locked ||
      flipped.includes(card.uid) ||
      matched.includes(card.name)
    ) {
      return;
    }

    speak(card.name);

    const newFlipped = [...flipped, card.uid];
    setFlipped(newFlipped);

    if (newFlipped.length < 2) return;

    setMoves((m) => m + 1);

    const [first, second] = newFlipped.map((uid) =>
      cards.find((c) => c.uid === uid)
    );

    // الكارتين متطابقين
    if (first.name === second.name) {
      const newMatched = [...matched, first.name];

      setMatched(newMatched);
      setFlipped([]);
      setStars((s) => s + 1);

      // الجولة خلصت
      if (newMatched.length === pairCount) {
        setTimeout(() => {
          Swal.fire({
            title: "Super gemacht! 🎉",
            text: `Runde ${round} geschafft in ${moves + 1} Zügen!`,
            icon: "success",
            confirmButtonText: "Nächste Runde ⭐",
            confirmButtonColor: "#f59e0b",
          }).then(() => startRound(round + 1));
        }, 600);
      }
      return;
    }

    // مش متطابقين: اقلبهم تاني بعد شوية
    setLocked(true);
    setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 900);
  };

  return (
    <div className="memory">
      <header className="memory-header">
        <h1>🧠 Memory</h1>

        <div className="memory-stats">
          <span>Runde {round}</span>
          <span>Züge {moves}</span>
          <span>⭐ {stars}</span>
        </div>
      </header>

      <main
        className="memory-board"
        style={{ "--cols": columnsFor(cards.length) }}
      >
        {cards.map((card) => {
          const isMatched = matched.includes(card.name);
          const isFlipped = isMatched || flipped.includes(card.uid);

          return (
            <button
              key={`${round}-${card.uid}`}
              type="button"
              className={`card ${isFlipped ? "flipped" : ""} ${
                isMatched ? "matched" : ""
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-face card-back">⭐</div>

                <div className="card-face card-front">
                  {card.type === "image" ? (
                    <img src={card.image} alt={card.name} />
                  ) : (
                    <span className="card-word">{card.name}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}

export default Gedächtnisspiel;