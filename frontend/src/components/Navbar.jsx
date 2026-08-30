import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./ui/Button";

// `to` values are route paths. Update these once the matching pages exist
// in AppRouter.jsx (e.g. add a "/pricing" route, then point this at it).
const NAV_LINKS = [
  { label: "Product", to: "/product" },
  { label: "For Retailers", to: "/retailers" },
  { label: "For Service Centers", to: "/service-centers" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4EC]/90 backdrop-blur border-b border-neutral-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-neutral-900">
          <span className="w-7 h-7 rounded-md bg-neutral-900 text-white text-xs font-mono flex items-center justify-center">
            W1
          </span>
          WarrantyOne
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-neutral-600">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 hover:text-neutral-900 ${
                    isActive ? "text-neutral-900 font-medium" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="hidden sm:block">
            <Button variant="secondary" className="text-sm px-5 py-2.5">
              Login
            </Button>
          </Link>

          <Link to="/register" className="hidden sm:block">
            <Button variant="primary" className="text-sm px-5 py-2.5">
              Register
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border-2 border-neutral-900 transition-transform duration-150 active:scale-95"
          >
            <span className="sr-only">Toggle menu</span>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                <path d="M0 1H18M0 7H18M0 13H18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-[#F6F4EC] px-4 sm:px-6 py-5">
          <ul className="flex flex-col gap-4 text-sm text-neutral-700">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block transition-colors duration-200 hover:text-neutral-900 ${
                      isActive ? "text-neutral-900 font-medium" : ""
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 mt-5">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              <Button variant="secondary" className="w-full text-sm py-2.5">
                Login
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="block">
              <Button variant="primary" className="w-full text-sm py-2.5">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
