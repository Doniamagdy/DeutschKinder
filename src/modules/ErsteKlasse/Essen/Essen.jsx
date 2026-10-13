import { useState } from "react";
import Swal from "sweetalert2";

import kitchenClosed from "../../../assets/Cartoon Kitchen Game (1).png";
import kitchenOpen from "../../../assets/Cartoon Kitchen Game (2).png";

import Pizza from "../../../assets/pizza.png";
import Eis from "../../../assets/ice-cream.webp";
import Kuchen from "../../../assets/kuchen.avif";
import Brot from "../../../assets/bread.jpg";
import Kaese from "../../../assets/cheese.avif";
import Schokolade from "../../../assets/chocholate.webp";
import Salat from "../../../assets/salad.jpg";
import Joghurt from "../../../assets/yogurt.png";


import "./Essen.css";

function Essen() {
  const [isOpen, setIsOpen] = useState(false);

  const foods = [
    {
      id: 1,
      name: "die Pizza",
      image: Pizza,
      position: "pizza",
    },
    {
      id: 2,
      name: "Eis",
      image: Eis,
      position: "eis",
    },
    {
      id: 3,
      name: "Kuchen",
      image: Kuchen,
      position: "kuchen",
    },
    {
      id: 4,
      name: "Brot",
      image: Brot,
      position: "brot",
    },
    {
      id: 5,
      name: "Käse",
      image: Kaese,
      position: "kaese",
    },
    {
      id: 6,
      name: "Schokolade",
      image: Schokolade,
      position: "schokolade",
    },
    {
      id: 7,
      name: "Salat",
      image: Salat,
      position: "salat",
    },
    {
      id: 8,
      name: "Joghurt",
      image: Joghurt,
      position: "joghurt",
    },
  ];

  const speakGerman = (foodName) => {
    window.speechSynthesis.cancel();

    const sentences = [
      foodName,
      `Das ist ${foodName}`,
      `Ich mag ${foodName}`,
    ];

    let index = 0;

    const speakNext = () => {
      if (index >= sentences.length) return;

      const utterance = new SpeechSynthesisUtterance(
        sentences[index]
      );

      utterance.lang = "de-DE";
      utterance.rate = 0.75;
      utterance.pitch = 1.1;

      utterance.onend = () => {
        index++;
        speakNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleFoodClick = (food) => {
    // النطق
    speakGerman(food.name);

    Swal.fire({
      title: food.name,

      html: `
        <div class="food-content">
          <img
            src="${food.image}"
            alt="${food.name}"
            class="food-image"
          />

          <p>Das ist <strong>${food.name}</strong>.</p>
          <p>Ich mag <strong>${food.name}</strong>.</p>
        </div>
      `,

      confirmButtonText: "Weiter ⭐",

      customClass: {
        popup: "food-popup",
        title: "food-title",
        confirmButton: "food-button",
      },
    });
  };

  return (
    <div className="game-screen">


      {/* Background */}
      <img
        src={isOpen ? kitchenOpen : kitchenClosed}
        alt="Kitchen"
        className="kitchen-background"
      />

      {/* Refrigerator */}
      <button
        className="fridge-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Refrigerator"
      />

      {/* Food */}
      {isOpen &&
        foods.map((food) => (
          <button
            key={food.id}
            className={`food-hotspot ${food.position}`}
            onClick={() => handleFoodClick(food)}
            aria-label={food.name}
          />
        ))}

    </div>
  );
}

export default Essen;