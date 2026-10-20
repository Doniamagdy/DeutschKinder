
import { useState, useEffect, useRef } from "react";
import "./WortBildDomino.css";

import haseImg from "../../../assets/cute-bunny-kids-toy-isolated-white-background-simple-plush-cute-little-baby-rabbit-vector-removebg-preview.png";
import igelImg from "../../../assets/cute-baby-hedgehog-cartoon-on-white-background-free-vector-removebg-preview.png";
import lamaImg from "../../../assets/lama.webp";
import pumaImg from "../../../assets/puma.png";
import dominoImg from "../../../assets/dominoes-clipart-xl.png";
import linealImg from "../../../assets/ruler-7781880_960_720.png";
import doseImg from "../../../assets/a79beef13a2089878fde335aa0188c57_t-removebg-preview.png";
import pinselImg from "../../../assets/transparent-image.png";

const WORDS = [
  { id: "hase", word: "Hase", img: haseImg },
  { id: "igel", word: "Igel", img: igelImg },
  { id: "lama", word: "Lama", img: lamaImg },
  { id: "puma", word: "Puma", img: pumaImg },
  { id: "domino", word: "Domino", img: dominoImg },
  { id: "lineal", word: "Lineal", img: linealImg },
  { id: "dose", word: "Dose", img: doseImg },
  { id: "pinsel", word: "Pinsel", img: pinselImg },
];

const ROUND_SIZE = 6;

const shuffle = (arr) => {
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

// Prefer words that were NOT in the previous round
function pickItems(prevIds = []) {
  const fresh = shuffle(
    WORDS.filter((item) => !prevIds.includes(item.id))
  );

  const seen = shuffle(
    WORDS.filter((item) => prevIds.includes(item.id))
  );

  return [...fresh, ...seen].slice(
    0,
    Math.min(ROUND_SIZE, WORDS.length)
  );
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.8;

  window.speechSynthesis.speak(utterance);
}

function beep(ok) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = ok ? "triangle" : "sawtooth";
    oscillator.frequency.value = ok ? 660 : 160;

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.25
    );

    oscillator.onended = () => ctx.close();

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio is optional
  }
}

/*
  Each tile contains:
  left half | right half

  The matching item appears as a word on one side
  and as a picture on the other side.
*/
function buildGame(prevIds = []) {
  const items = shuffle(pickItems(prevIds));
  const n = items.length;

  const rightTypes = items.map(() =>
    Math.random() < 0.5 ? "pic" : "word"
  );

  const tiles = items.map((item, k) => {
    const prevRight = rightTypes[(k + n - 1) % n];

    return {
      id: k,
      left: {
        item,
        type: prevRight === "pic" ? "word" : "pic",
      },
      right: {
        item: items[(k + 1) % n],
        type: rightTypes[k],
      },
    };
  });

  return {
    chain: [tiles[0]],
    hand: shuffle(tiles.slice(1)),
    total: n,
  };
}

function Pic({ item }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="wbd-fallback">
        {item.word[0]}
      </span>
    );
  }

  return (
    <img
      className="wbd-img"
      src={item.img}
      alt={item.word}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

function Half({ half, isOpen, speakable }) {
  return (
    <span
      className={`wbd-half${isOpen ? " is-open" : ""}`}
      onClick={
        speakable
          ? () => speak(half.item.word)
          : undefined
      }
    >
      {half.type === "word" ? (
        <span className="wbd-word">
          {half.item.word}
        </span>
      ) : (
        <Pic item={half.item} />
      )}
    </span>
  );
}

function Tile({ tile, onPlace, glow, shake, openEnd }) {
  const halves = (
    <>
      <Half
        half={tile.left}
        speakable={!onPlace}
      />

      <span className="wbd-divider" />

      <Half
        half={tile.right}
        isOpen={openEnd}
        speakable={!onPlace}
      />
    </>
  );

  if (onPlace) {
    return (
      <button
        type="button"
        className={`wbd-tile is-hand${
          glow ? " is-glow" : ""
        }${shake ? " is-shake" : ""}`}
        onClick={onPlace}
      >
        {halves}
      </button>
    );
  }

  return <div className="wbd-tile">{halves}</div>;
}

export default function WortBildDomino() {
  const [game, setGame] = useState(() => buildGame());
  const [mistakes, setMistakes] = useState(0);
  const [wrongInRow, setWrongInRow] = useState(0);
  const [shakeId, setShakeId] = useState(null);

  const endRef = useRef(null);

  const { chain, hand, total } = game;

  const open = chain[chain.length - 1].right;
  const done = hand.length === 0;

  const stars =
    mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1;

  useEffect(() => {
    speak(open.item.word);

    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chain.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const fits = (tile) =>
    tile.left.item.id === open.item.id &&
    tile.left.type !== open.type;

  const place = (tile) => {
    if (fits(tile)) {
      beep(true);
      setWrongInRow(0);

      setGame((current) => ({
        ...current,
        chain: [...current.chain, tile],
        hand: current.hand.filter(
          (item) => item.id !== tile.id
        ),
      }));
    } else {
      beep(false);
      setMistakes((count) => count + 1);
      setWrongInRow((count) => count + 1);
      setShakeId(tile.id);

      setTimeout(() => {
        setShakeId(null);
      }, 400);
    }
  };

  const restart = () => {
    setGame(
      buildGame(
        chain.map((tile) => tile.left.item.id)
      )
    );

    setMistakes(0);
    setWrongInRow(0);
    setShakeId(null);
  };

  return (
    <div className="wbd-page">
      <h1 className="wbd-title">
        Wort-Bild Domino
      </h1>

      {!done && (
        <div className="wbd-ask">
          <span>Was passt zu</span>

          <button
            type="button"
            className="wbd-ask-btn"
            onClick={() => speak(open.item.word)}
          >
            <span aria-hidden="true">🔊</span>

            {open.type === "word" ? (
              <b>{open.item.word}</b>
            ) : (
              <span className="wbd-ask-pic">
                <Pic item={open.item} />
              </span>
            )}
          </button>

          <span>?</span>
        </div>
      )}

      <div className="wbd-chain">
        {chain.map((tile, index) => (
          <Tile
            key={tile.id}
            tile={tile}
            openEnd={
              !done && index === chain.length - 1
            }
          />
        ))}

        <div ref={endRef} />
      </div>

      {!done ? (
        <>
          <p className="wbd-hint">
            {chain.length}/{total}
          </p>

          <div className="wbd-hand">
            {hand.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                onPlace={() => place(tile)}
                shake={shakeId === tile.id}
                glow={
                  wrongInRow >= 2 && fits(tile)
                }
              />
            ))}
          </div>
        </>
      ) : (
        <div className="wbd-done">
          <div className="wbd-stars">
            {"⭐".repeat(stars)}
            {"☆".repeat(3 - stars)}
          </div>

          <p className="wbd-lead">
            Toll gemacht!
          </p>

          <button
            type="button"
            className="wbd-btn"
            onClick={restart}
          >
            Nochmal
          </button>
        </div>
      )}
    </div>
  );
}
