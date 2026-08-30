import React from "react";
import IconTile from "./ui/IconTile";

const LOGOS = [
  { letter: "A", name: "Aurea Electronics", tone: "dark" },
  { letter: "N", name: "Nordic Home", tone: "dark" },
  { letter: "P", name: "PixelPoint", tone: "dark" },
  { letter: "V", name: "Voltbox", tone: "dark" },
];

export default function TrustedBy() {
  return (
    <section className="bg-[#EFEBDF] border-y-2 border-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-[14rem_repeat(4,1fr)] gap-y-8 gap-x-10 items-start">
        <p className="text-sm text-neutral-600 pt-1.5">
          Trusted by fast-growing retailers and service networks.
        </p>

        {LOGOS.map((logo) => (
          <div
            key={logo.name}
            className="flex items-start gap-3 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <IconTile tone={logo.tone}>{logo.letter}</IconTile>
            <span className="text-sm font-medium text-neutral-800">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
