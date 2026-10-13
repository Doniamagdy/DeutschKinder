import { Routes, Route } from "react-router-dom";
import "./App.css";
import PublicLayout from "./shared/components/Layout/PublicLayout";
import Home from "./modules/Home/Home";
import Essen from "./modules/ErsteKlasse/Essen/Essen";
import Einkaufen from "./modules/ErsteKlasse/Einkaufen/Einkaufen";
import Gedächtnisspiel from "./modules/ErsteKlasse/Gedächtnisspiel/Gedächtnisspiel";

import Spielzeuge from "./modules/ZweiteKlasse/Spielzeuge/Spielzeuge"
import VerstecktSpiel from "./modules/ZweiteKlasse/VerstecktSpiel/VerstecktSpiel";


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

      </Route>
    </Routes>
  );
}

export default App;
