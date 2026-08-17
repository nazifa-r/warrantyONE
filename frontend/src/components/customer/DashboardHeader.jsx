import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import IconTile from "../ui/IconTile";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard/customer" },
  { label: "My Products", to: "/dashboard/customer/products" },
  { label: "Repairs", to: "/dashboard/customer/repairs" },
  { label: "Payments", to: "/dashboard/customer/payments" },
];

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default function DashboardHeader({ user, initials }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth token / session here
    console.log("Logging out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4EC]/90 backdrop-blur border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
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
                end={link.to === "/dashboard/customer"}
                className={({ isActive }) =>
                  `transition-colors duration-200 hover:text-neutral-900 ${
                    isActive ? "text-neutral-900 font-medium underline underline-offset-4 decoration-2" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-sm text-neutral-700">
            {user.firstName} {user.lastName}
          </span>
          <IconTile tone="violet">{initials}</IconTile>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-2 border-neutral-900 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wide text-neutral-700 bg-white transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
          >
            <LogoutIcon />
            Logout
          </button>

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
                  end={link.to === "/dashboard/customer"}
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

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-neutral-900 px-4 py-2.5 text-xs font-mono uppercase tracking-wide text-neutral-700 bg-white transition-colors duration-150 hover:bg-neutral-900 hover:text-white"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}