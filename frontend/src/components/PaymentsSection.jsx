import React from "react";
import SectionHeader from "./ui/SectionHeader";
import Card from "./ui/Card";

const PAYMENT_TAGS = ["Stripe Test Mode", "SSLCommerz Sandbox", "PCI-aware"];

const PAYMENT_METHODS = [
  {
    icon: "💳",
    title: "Cards",
    description: "Visa, Mastercard, and local debit cards via Stripe Test Mode.",
  },
  {
    icon: "📱",
    title: "Mobile wallets",
    description: "bKash, Nagad, and Rocket through SSLCommerz Sandbox.",
  },
  {
    icon: "🏦",
    title: "Bank transfer",
    description: "Direct transfer for larger repair or trade-in settlements.",
  },
];

export default function PaymentsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <SectionHeader
        accent="lavender"
        eyebrow="Getting paid, made simple"
        title="Payments that just clear."
        subtitle="Repairs, extended warranties, and trade-in top-ups — settled through one sandboxed gateway, logged straight into the invoice."
      />

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg p-8 flex flex-col justify-between shadow-[4px_4px_0_0_#78716c] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#78716c]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wide text-amber-300">
              Sandbox mode
            </span>
            <h3 className="text-2xl font-semibold mt-3 leading-snug">
              One checkout, every payment in the system.
            </h3>
            <p className="mt-4 text-neutral-400 text-sm leading-relaxed">
              Every repair invoice and warranty extension routes through the
              same secure, ACID-compliant payment flow — so nothing gets
              marked paid until the transaction actually clears.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {PAYMENT_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono uppercase tracking-wide bg-amber-300 text-neutral-900 rounded px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          {PAYMENT_METHODS.map((method) => (
            <Card key={method.title} className="flex items-start gap-4">
              <span className="text-2xl" aria-hidden="true">
                {method.icon}
              </span>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">
                  {method.title}
                </h4>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {method.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
