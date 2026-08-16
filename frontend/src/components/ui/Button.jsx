import React from "react";

/**
 * Reusable Button
 * variants: "primary" (black fill), "secondary" (outline), "accent" (yellow fill)
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium border-2 border-neutral-900 transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900";

  const variants = {
    primary:
      "bg-neutral-900 text-white shadow-[3px_3px_0_0_#111827] hover:bg-neutral-800 hover:shadow-[5px_5px_0_0_#111827]",
    secondary:
      "bg-white text-neutral-900 shadow-[3px_3px_0_0_#111827] hover:bg-neutral-50 hover:shadow-[5px_5px_0_0_#111827]",
    accent:
      "bg-amber-300 text-neutral-900 shadow-[3px_3px_0_0_#111827] hover:bg-amber-200 hover:shadow-[5px_5px_0_0_#111827]",
    glow:
      "bg-neutral-900 text-amber-300 shadow-[0_12px_28px_-6px_rgba(251,146,60,0.55)] hover:bg-neutral-800 hover:shadow-[0_16px_34px_-6px_rgba(251,146,60,0.7)]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
