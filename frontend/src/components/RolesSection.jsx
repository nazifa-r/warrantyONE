import React from "react";
import SectionHeader from "./ui/SectionHeader";
import Card from "./ui/Card";
import IconTile from "./ui/IconTile";

const ROLES = [
  {
    letter: "C",
    tone: "coral",
    title: "Customer",
    items: ["Register products", "Track repairs", "Pay securely", "Request trade-ins"],
  },
  {
    letter: "R",
    tone: "mint",
    title: "Retailer",
    items: ["Activate warranties", "Verify purchases", "Sell extensions"],
  },
  {
    letter: "S",
    tone: "amber",
    title: "Service Center",
    items: ["Assign technicians", "Manage parts stock", "Issue invoices"],
  },
  {
    letter: "A",
    tone: "violet",
    title: "Administrator",
    items: ["Manage roles & plans", "Monitor claims", "View analytics"],
  },
];

export default function RolesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <SectionHeader
        accent="coral"
        eyebrow="Built for four roles"
        title="One system, four vantage points."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ROLES.map((role) => (
          <Card key={role.title}>
            <IconTile tone={role.tone} className="mb-5">
              {role.letter}
            </IconTile>
            <h3 className="font-semibold text-neutral-900 mb-3">{role.title}</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              {role.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-neutral-300">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
