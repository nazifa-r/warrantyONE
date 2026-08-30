import React from "react";
import SectionHeader from "./ui/SectionHeader";
import Card from "./ui/Card";
import IconTile from "./ui/IconTile";

const STEPS = [
  {
    number: "01",
    title: "Register",
    description:
      "Customer or retailer registers the device and its invoice. A digital warranty is generated the same moment.",
  },
  {
    number: "02",
    title: "Verify",
    description:
      "Anyone — customer, retailer, or service center — verifies warranty status instantly by serial number.",
  },
  {
    number: "03",
    title: "Repair",
    description:
      "A repair request becomes an order, a technician is assigned, and parts are drawn from inventory.",
  },
  {
    number: "04",
    title: "Record",
    description:
      "Repair history, invoice, and payment are logged — feeding reminders, analytics, and future trade-in value.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <SectionHeader
        accent="lavender"
        eyebrow="How it moves through the system"
        title="Every device follows the same trail."
        subtitle="From the day it's registered to the day it's traded in — one continuous, auditable record."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((step) => (
          <Card key={step.number}>
            <IconTile tone="dark" className="mb-5">
              {step.number}
            </IconTile>
            <h3 className="font-semibold text-neutral-900 mb-2">{step.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {step.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
