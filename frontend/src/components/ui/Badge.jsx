import React from "react";

/**
 * Reusable Badge
 * variants: "mint" (green pill), "status" (small rounded status chip),
 * "eyebrow" (uppercase monospace label, no background)
 */
export default function Badge({ children, variant = "mint", className = "" }) {
  const variants = {
    mint: "inline-flex items-center gap-2 rounded-full bg-emerald-300 text-neutral-900 border-2 border-neutral-900 px-4 py-1.5 text-xs font-mono tracking-wide uppercase",
    status:
      "inline-flex items-center rounded-md bg-emerald-300 text-neutral-900 border-2 border-neutral-900 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide",
    warn: "inline-flex items-center rounded-md bg-amber-300 text-neutral-900 border-2 border-neutral-900 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide",
    eyebrow:
      "text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500",
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
