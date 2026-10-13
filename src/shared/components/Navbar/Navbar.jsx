import Logo from "../../../assets/animal.png"
import Flag from "../../../assets/german-flag.png"
import { Link } from "react-router";


function Navbar() {
  return (
   <nav className="bg-[#fffff4] px-4 py-3 shadow-md sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-9xl items-center justify-between">

        {/* Logo */}
        <Link
         href="/"
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          {/* Replace this with your cute logo image */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full  shadow-md sm:h-14 sm:w-14">
            <img src={Logo} alt="Logo" />
          </div>

         

          <span className="text-lg font-extrabold  sm:text-xl lg:text-2xl">
            Deutsch für Kinder
          </span>





        </Link>


        <Link to="/essen">Essen</Link>
        <Link to="/einkaufen">Einkaufen</Link>
        <Link to="/spielzeuge">Spielzeuge</Link>
        <Link to="/gedaechtnisspiel">Gedächtnisspiel</Link>
        <Link to="/verstecktspiel">Verstecktspiel</Link>


        {/* Cute right-side illustration */}
        <div className="hidden h-14 w-14 items-center justify-center rounded-full sm:flex lg:h-16 lg:w-16 lg:text-4xl">
         <img src={Flag} alt="Flag" />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Menü öffnen"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F9C74F] text-xl shadow-md transition hover:scale-105 md:hidden"
        >
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar
