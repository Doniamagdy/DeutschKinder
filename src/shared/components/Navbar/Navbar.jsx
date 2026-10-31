
import { useState } from "react";
import Logo from "../../../assets/animal.png";
import Flag from "../../../assets/german-flag.png";
import { Link } from "react-router";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Grade 1 List", path: "/grade-1-list" },
    { name: "Grade 2 List", path: "/grade-2-list" },
    { name: "Year 1 List", path: "/year-1-list" },
    { name: "Year 2 List", path: "/year-2-list" },
  ];

  return (
    <nav className="relative bg-[#fffff4] px-3 py-3 shadow-md sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-9xl items-center justify-between gap-3">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex shrink-0 items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-md sm:h-14 sm:w-14">
            <img
              src={Logo}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <span className="text-sm font-extrabold sm:text-xl lg:text-2xl">
            Deutsch für Kinder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
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

        {/* Flag */}
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center sm:flex lg:h-14 lg:w-14">
          <img
            src={Flag}
            alt="German flag"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F9C74F] text-xl shadow-md transition hover:scale-105 lg:hidden"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-t border-yellow-100 bg-[#fffff4] px-4 py-3 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-9xl flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#F9C74F]/20 hover:text-orange-600"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex justify-center pt-2 sm:hidden">
              <img
                src={Flag}
                alt="German flag"
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
