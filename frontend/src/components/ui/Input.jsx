import React from "react";

/**
 * Reusable labeled text input.
 * `trailing` lets you drop an inline action inside the field (e.g. a "Show" toggle).
 */
export default function Input({
  label,
  id,
  type = "text",
  trailing,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-neutral-900 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          className="w-full bg-white border-2 border-neutral-900 rounded-md px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-shadow duration-150 focus:outline-none focus:shadow-[3px_3px_0_0_#111827]"
          {...props}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
