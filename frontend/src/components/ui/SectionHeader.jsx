import React from "react";
import Badge from "./Badge";

const ACCENT_COLORS = {
  coral: "bg-orange-300",
  lavender: "bg-violet-300",
  mint: "bg-emerald-300",
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  accent = "coral",
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const justifyClass = align === "center" ? "justify-center" : "";

  return (
    <div className={`max-w-2xl ${alignClass} mb-12`}>
      {eyebrow && (
        <div className={`flex items-center gap-2 mb-3 ${justifyClass}`}>
          <span
            className={`w-2.5 h-2.5 rounded-sm border-2 border-neutral-900 ${ACCENT_COLORS[accent]}`}
            aria-hidden="true"
          />
          <Badge variant="eyebrow">{eyebrow}</Badge>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-neutral-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
