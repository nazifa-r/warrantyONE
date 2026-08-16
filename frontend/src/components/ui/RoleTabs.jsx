import React from "react";

/**
 * Reusable pill-style role selector.
 * roles: [{ value, label }]
 */
export default function RoleTabs({ roles, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Account role">
      {roles.map((role) => {
        const active = role.value === value;
        return (
          <button
            key={role.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(role.value)}
            className={`rounded-full border-2 border-neutral-900 px-4 py-1.5 text-xs font-mono uppercase tracking-wide transition-all duration-150 ease-out hover:-translate-y-0.5 ${
              active
                ? "bg-neutral-900 text-white shadow-[2px_2px_0_0_#111827]"
                : "bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
