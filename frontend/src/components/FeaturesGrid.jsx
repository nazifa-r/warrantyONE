import React from "react";
import SectionHeader from "./ui/SectionHeader";
import Card from "./ui/Card";

const FEATURES = [
  {
    title: "Maintenance reminders",
    description: "Automatic alerts before warranty expiry and scheduled service dates.",
  },
  {
    title: "Spare parts inventory",
    description: "Parts used in repairs are deducted from stock in real time.",
  },
  {
    title: "Secure payments",
    description: "Sandboxed card processing for repairs and warranty extensions.",
  },
  {
    title: "Device trade-ins",
    description: "Value estimated from age, condition, and repair history.",
  },
  {
    title: "Repair history",
    description: "A complete, timestamped service record for every device.",
  },
  {
    title: "Analytics dashboard",
    description: "Failure trends, technician performance, and repair revenue.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <SectionHeader
        accent="mint"
        eyebrow="What's tracked"
        title="Nothing falls through the cracks."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <h3 className="font-semibold text-neutral-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
