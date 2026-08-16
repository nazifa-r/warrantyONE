import React from "react";
import Button from "./ui/Button";

export default function CTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg px-8 py-12 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[6px_6px_0_0_#78716c] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_#78716c]">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug max-w-lg">
            Stop reissuing warranty cards that get lost in a drawer.
          </h2>
          <p className="mt-3 text-neutral-400 text-sm">
            Register your first product in under two minutes.
          </p>
        </div>

        <Button variant="accent" className="whitespace-nowrap">
          Register a product
        </Button>
      </div>
    </section>
  );
}
