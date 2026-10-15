
import Swal from "sweetalert2";
import "./Spielzeuge.css";

import toyShopBg from "../../../assets/spielzeuge.jpeg";
import Lama from "../../../assets/lama.webp";
import Igel from "../../../assets/igel.jpg";
import Hase from "../../../assets/hase.avif";
import Puma from "../../../assets/puma.png";
import Esel from "../../../assets/esel.png";

const animals = [
  { id: "hase", article: "der", name: "Hase", image: Hase },
  { id: "igel", article: "der", name: "Igel", image: Igel },
  { id: "lama", article: "der", name: "Lama", image: Lama },
  { id: "esel", article: "der", name: "Esel", image: Esel },
  { id: "puma", article: "der", name: "Puma", image: Puma },
];

function Spielzeuge() {
  const handleClick = (animal) => {
    const word = `${animal.article} ${animal.name}`;

    Swal.fire({
      title: word,

      imageUrl: animal.image,
      imageWidth: 150,
      imageHeight: "auto",
      imageAlt: animal.name,
      imageCssClass: "animal-popup-image",

      confirmButtonText: "🔊 Nochmal hören",
      confirmButtonColor: "#f59e0b",

      showCloseButton: true,

      didOpen: () => {
        const speak = () => {
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(word);
          utterance.lang = "de-DE";
          utterance.rate = 0.8;

          window.speechSynthesis.speak(utterance);
        };

        speak();

        // تشغيل النطق مرة أخرى عند الضغط على الزر
        const button = Swal.getConfirmButton();

        button?.addEventListener("click", (event) => {
          event.preventDefault();
          speak();
        });
      },
    });
  };

  return (
    <div className="game-screen">
      <div className="toy-room">
        <img
          className="toy-background"
          src={toyShopBg}
          alt="Spielzeugladen"
        />

        {animals.map((animal) => (
          <button
            key={animal.id}
            type="button"
            className={`toy-hotspot ${animal.id}`}
            onClick={() => handleClick(animal)}
            aria-label={animal.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Spielzeuge;
