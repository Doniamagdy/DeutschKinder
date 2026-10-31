import { Routes, Route } from "react-router-dom";
import "./App.css";
import PublicLayout from "./shared/components/Layout/PublicLayout";
import Home from "./modules/Home/Home";
import Essen from "./modules/ErsteKlasse/Essen/Essen";
import Einkaufen from "./modules/ErsteKlasse/Einkaufen/Einkaufen";
import Gedächtnisspiel from "./modules/ErsteKlasse/Gedächtnisspiel/Gedächtnisspiel";

import Spielzeuge from "./modules/ZweiteKlasse/Spielzeuge/Spielzeuge";
import VerstecktSpiel from "./modules/ZweiteKlasse/VerstecktSpiel/VerstecktSpiel";

import ErsteKlasseHome from "./modules/ErsteKlasseHome/ErsteKlasseHome";
import ZweiteKlasseHome from "./modules/ZweiteKlasseHome/ZweiteKlasseHome";
// import Zahlen from "./modules/ErsteKlasse/Zahlen/Zahlen";

import Grade1List from "./modules/KlassenListe/Grade1/Grade1List";

import Grade2List from "./modules/KlassenListe/Grade2/Grade2List";

import Year1List from "./modules/KlassenListe/Year1/Year1List";

import Year2List from "./modules/KlassenListe/Year2/Year2List";

import FroschSpiel from "./modules/ErsteKlasse/FroschSpiel/FroschSpiel";

import WortBildDomino from "./modules/ZweiteKlasse/WortBildDomino/WortBildDomino";
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="essen" element={<Essen />} />
        <Route path="spielzeuge" element={<Spielzeuge />} />
        <Route path="einkaufen" element={<Einkaufen />} />
        <Route path="gedaechtnisspiel" element={<Gedächtnisspiel />} />
        <Route path="verstecktspiel" element={<VerstecktSpiel />} />

        <Route path="frosch-spiel" element={<FroschSpiel />} />

        <Route path="erste-klasse" element={<ErsteKlasseHome />} />

        <Route path="zweite-klasse" element={<ZweiteKlasseHome />} />

        <Route path="grade-1-list" element={<Grade1List />} />

        <Route path="grade-2-list" element={<Grade2List />} />

        <Route path="year-1-list" element={<Year1List />} />

        <Route path="year-2-list" element={<Year2List />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />

        <Route path="domino" element={<WortBildDomino />} />
      </Route>
    </Routes>
  );
}

export default App;
