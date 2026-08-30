import React from "react";

/**
 * Reusable Card — neo-brutalist bordered card: solid 2px black border,
 * hard offset shadow (no blur), and a punchy shift on hover instead of a soft lift.
 * Used for step cards, role cards, feature cards, payment method cards.
 */
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#111827] ${className}`}
    >
      {children}
    </div>
  );
}
