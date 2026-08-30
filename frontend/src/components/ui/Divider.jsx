import React from "react";

/**
 * Reusable Divider
 * tone: "light" (subtle hairline) | "strong" (darker rule, used around banded sections)
 * inset: optional max-width container to align with page content
 */
export default function Divider({ tone = "light", inset = true }) {
  const toneClasses = {
    // "light" still reads as a clear rule against the cream background,
    // just lighter-weight than "strong".
    light: "border-neutral-400",
    strong: "border-neutral-900",
  };

  return (
    <div className={inset ? "max-w-6xl mx-auto px-4 sm:px-6" : ""}>
      <hr className={`border-t-2 ${toneClasses[tone]}`} />
    </div>
  );
}
