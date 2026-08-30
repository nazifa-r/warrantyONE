import React from "react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Overview", to: "/product" },
      { label: "For Retailers", to: "/retailers" },
      { label: "For Service Centers", to: "/service-centers" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Register a product", to: "/register" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "https://twitter.com",
    path: "M1 1L13 13M13 1L1 13",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M2 5H4.5V13H2V5ZM3.25 1.5C4.08 1.5 4.5 2.02 4.5 2.75C4.5 3.48 4.08 4 3.25 4C2.42 4 2 3.48 2 2.75C2 2.02 2.42 1.5 3.25 1.5ZM6.5 5H9V6.2C9.4 5.5 10.2 4.8 11.5 4.8C13.5 4.8 14 6.1 14 8V13H11.5V8.5C11.5 7.5 11.2 6.9 10.4 6.9C9.5 6.9 9 7.5 9 8.5V13H6.5V5Z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    path: "M7 0C3.1 0 0 3.1 0 7C0 10.1 2 12.7 4.8 13.6C5.2 13.7 5.3 13.4 5.3 13.2V12C3.4 12.4 3 11.1 3 11.1C2.7 10.4 2.3 10.2 2.3 10.2C1.7 9.8 2.3 9.8 2.3 9.8C3 9.9 3.4 10.5 3.4 10.5C4 11.5 4.9 11.2 5.3 11.1C5.4 10.6 5.6 10.3 5.8 10.1C4.3 9.9 2.7 9.3 2.7 6.7C2.7 6 3 5.4 3.4 5C3.3 4.7 3.1 4 3.5 3.1C3.5 3.1 4 3 5.3 3.8C5.9 3.6 6.5 3.5 7 3.5C7.6 3.5 8.1 3.6 8.7 3.8C10 3 10.5 3.1 10.5 3.1C10.9 4 10.7 4.7 10.6 5C11 5.4 11.3 6 11.3 6.7C11.3 9.3 9.6 9.9 8.2 10.1C8.4 10.3 8.6 10.7 8.6 11.4V13.2C8.6 13.4 8.7 13.7 9.2 13.6C12 12.7 14 10.1 14 7C14 3.1 10.9 0 7 0Z",
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-neutral-900 bg-[#EFEBDF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-x-8 gap-y-10">
        {/* Brand + blurb + socials */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-neutral-900"
          >
            <span className="w-7 h-7 rounded-md border-2 border-neutral-900 bg-neutral-900 text-white text-xs font-mono flex items-center justify-center">
              W1
            </span>
            WarrantyOne
          </Link>
          <p className="mt-4 text-sm text-neutral-600 max-w-xs leading-relaxed">
            One digital warranty record per device — verified instantly,
            tracked through every repair.
          </p>

          <div className="flex items-center gap-2.5 mt-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="w-9 h-9 inline-flex items-center justify-center rounded-md border-2 border-neutral-900 bg-white shadow-[2px_2px_0_0_#111827] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#111827] hover:bg-amber-300"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d={social.path} stroke="#111827" strokeWidth="1.3" fill="#111827" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500 mb-4">
              {column.heading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-neutral-700 transition-colors duration-200 hover:text-neutral-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Mini CTA panel */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500 mb-4">
            Get started
          </h4>
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            Register your first device and see the record it creates.
          </p>
          <Link to="/register" className="block w-full sm:w-fit">
            <Button variant="accent" className="w-full sm:w-fit text-sm px-5 py-2.5">
              Register a product
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-t-2 border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 text-center sm:text-left">
          <span className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-sm border border-neutral-900 bg-violet-300"
              aria-hidden="true"
            />
            © {new Date().getFullYear()} WarrantyOne. All rights reserved.
          </span>
          <span className="font-mono">React · FastAPI · PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}
