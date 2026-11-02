
import { useState } from "react";
import Logo from "../../../assets/animal.png";
import Flag from "../../../assets/german-flag.png";
import Ampel from "../../../assets/traffic-light.png";
import { Link } from "react-router";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Grade 1 List", path: "/grade-1-list" },
    { name: "Grade 2 List", path: "/grade-2-list" },
    { name: "Year 1 List", path: "/year-1-list" },
    { name: "Year 2 List", path: "/year-2-list" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative z-50 w-full bg-[#fffff4] px-2 py-2 shadow-md sm:px-3 lg:px-4">

      <div className="flex w-full items-center justify-between gap-2">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-1.5 transition-transform duration-200 hover:scale-105"
        >
          <img
            src={Logo}
            alt="Deutsch für Kinder Logo"
            className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          />

          <span className="whitespace-nowrap text-xs font-extrabold text-gray-800 sm:text-base lg:text-xl">
            Deutsch für Kinder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-center gap-3 lg:flex xl:gap-5">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="whitespace-nowrap text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-[#F9C74F] xl:text-base"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">

          <Link
            to="/ampel"
            aria-label="Traffic light"
            className="transition-transform duration-200 hover:scale-110"
          >
            <img
              src={Ampel}
              alt="Traffic light"
              className="h-10 w-10 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
            />
          </Link>

          <img
            src={Flag}
            alt="German flag"
            className="h-10 w-10 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
          />

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F9C74F] text-xl text-gray-800 shadow-sm transition hover:bg-yellow-400 active:scale-95 lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mt-3 flex flex-col gap-1 border-t border-yellow-100 pt-3">

            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#F9C74F]/20 hover:text-orange-600"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Icons */}
            <div className="flex items-center justify-center gap-5 border-t border-yellow-100 pt-3 sm:hidden">

              <Link to="/ampel" onClick={closeMenu}>
                <img
                  src={Ampel}
                  alt="Traffic light"
                  className="h-10 w-10 object-contain"
                />
              </Link>

              <img
                src={Flag}
                alt="German flag"
                className="h-10 w-10 object-contain"
              />

            </div>

          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
