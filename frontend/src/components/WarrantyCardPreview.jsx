import React from "react";
import Badge from "./ui/Badge";

const ROWS = [
  { label: "Purchased", value: "14 Mar 2026" },
  { label: "Coverage", value: "Extended · 24 mo", mono: true },
  { label: "Expires", value: "14 Mar 2028" },
];

export default function WarrantyCardPreview() {
  return (
    <div className="relative">
      {/* stacked backdrop sheet for a "card" depth effect */}
      <div className="absolute -right-3 -bottom-3 sm:-right-5 sm:-bottom-5 w-full h-full rounded-lg bg-violet-300 border-2 border-neutral-900 -z-10" />

      <div className="bg-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#111827]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
              Digital Warranty
            </p>
            <h3 className="text-lg font-semibold text-neutral-900">Aurea A14 Laptop</h3>
          </div>
          <Badge variant="status">● Active</Badge>
        </div>

        <dl className="space-y-3 border-t border-neutral-100 pt-4">
          {ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <dt className="text-neutral-500">{row.label}</dt>
              <dd className={`text-neutral-900 ${row.mono ? "font-mono text-xs" : ""}`}>
                {row.value}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm">
            <dt className="text-neutral-500">Status</dt>
            <dd>
              <Badge variant="warn">Verified</Badge>
            </dd>
          </div>
        </dl>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
          <span className="text-[11px] font-mono text-neutral-400">
            SN-8842-AX10-7731
          </span>
          <div
            className="w-8 h-8 rounded-sm"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #111 0 2px, transparent 2px 4px)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
