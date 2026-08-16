import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";

/**
 * Generic placeholder page — swap this out with real page content
 * once a route is ready. Keeps Navbar/Footer consistent across all pages.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <div className="bg-[#F6F4EC] text-neutral-900 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500">
          Coming soon
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4">{title}</h1>
        <p className="text-neutral-600 leading-relaxed mb-8">{description}</p>
        <Link to="/">
          <Button variant="secondary">← Back to home</Button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
