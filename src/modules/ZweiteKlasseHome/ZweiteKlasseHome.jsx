import { Link } from "react-router-dom"

function ZweiteKlasseHome() {
  return (
    <div>
       <Link to="/spielzeuge">Spielzeuge</Link>
      <Link to="/gedaechtnisspiel">Gedächtnisspiel</Link>
      <Link to="/verstecktspiel">Verstecktspiel</Link>
    </div>
  )
}

export default ZweiteKlasseHome
