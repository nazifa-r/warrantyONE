import React from "react";

const STATS = [
  { value: "21", label: "Linked record tables", tone: "plain" },
  { value: "0", label: "Paper cards required", tone: "coral" },
  { value: "4", label: "Roles, one platform", tone: "plain" },
  { value: "24/7", label: "Instant verification", tone: "mint" },
];

const toneClasses = {
  plain: "text-neutral-900",
  coral: "bg-orange-200 text-orange-900 rounded-lg px-3 py-1",
  mint: "bg-emerald-100 text-emerald-900 rounded-lg px-3 py-1 border border-emerald-200",
};

function StatItem({ value, label, tone }) {
  return (
    <div className="flex flex-col items-center md:items-start gap-2 transition-transform duration-200 hover:-translate-y-0.5">
      <span className={`text-3xl font-bold w-fit ${toneClasses[tone]}`}>{value}</span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
