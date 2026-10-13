import Swal from "sweetalert2";

import "./Spielzeuge.css";

import toyShopBg from "../../../assets/spielzeuge.jpeg";
import Lama from "../../../assets/lama.webp"
import Igel from "../../../assets/igel.jpg"
import Hase from "../../../assets/hase.avif"
import Puma from "../../../assets/puma.png"
import Esel from "../../../assets/esel.png"


const animals = [
  { id: "hase", article: "der", name: "Hase", image: Hase },
  { id: "igel", article: "der", name: "Igel", image: Igel },
  { id: "lama", article: "das", name: "Lama", image: Lama },
  { id: "esel", article: "der", name: "Esel", image: Esel  },
  { id: "puma", article: "der", name: "Puma", image: Puma },
];

function Spielzeuge() {
  const handleClick = (animal) => {
    Swal.fire({
              title: `${animal.article} ${animal.name}`,

        html:  `<div>
            <img src="${animal.image}"  />
        </div> `,
       
      confirmButtonText: "Weiter",
      confirmButtonColor: "#f59e0b",
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