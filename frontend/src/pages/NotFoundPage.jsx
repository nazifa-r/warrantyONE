import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="bg-[#F6F4EC] text-neutral-900 min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-500">
          404
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
          This page isn't registered.
        </h1>
        <p className="text-neutral-600 mb-8">
          The route you're looking for doesn't exist yet.
        </p>
        <Link to="/">
          <Button variant="primary">← Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
