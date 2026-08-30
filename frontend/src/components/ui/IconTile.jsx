import React from "react";

const toneMap = {
  dark: "bg-neutral-900 text-white border-neutral-900",
  coral: "bg-orange-300 text-neutral-900 border-neutral-900",
  mint: "bg-emerald-300 text-neutral-900 border-neutral-900",
  amber: "bg-amber-300 text-neutral-900 border-neutral-900",
  violet: "bg-violet-300 text-neutral-900 border-neutral-900",
};

/**
 * Small square tile used for step numbers, role letters, and feature icons.
 */
export default function IconTile({ children, tone = "dark", className = "" }) {
  return (
    <div
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md border-2 font-mono text-sm font-semibold ${toneMap[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
