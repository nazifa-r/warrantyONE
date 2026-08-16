import React from "react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import WarrantyCardPreview from "./WarrantyCardPreview";

export default function Hero() {
  return (
    <section id="top" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <Badge variant="mint" className="mb-6">
          ● Digital Warranty · Purchase → Repair
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-[1.1]">
          Your warranty card,
          <br />
          finally{" "}
          <span className="relative inline-block px-2">
            <span className="absolute inset-0 -rotate-1 rounded-full bg-orange-300 -z-10" />
            durable.
          </span>
        </h1>

        <p className="mt-6 text-neutral-600 leading-relaxed max-w-md">
          WarrantyOne replaces paper warranty cards and lost invoices with one
          record per device — verified instantly, tracked through every
          repair, ready when a claim needs it.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary">Register a product</Button>
          <Button variant="secondary">Verify a warranty →</Button>
        </div>
      </div>

      <WarrantyCardPreview />
    </section>
  );
}
