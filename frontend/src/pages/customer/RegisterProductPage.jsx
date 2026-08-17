import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DashboardHeader from "../../components/customer/DashboardHeader";

const CATEGORIES = ["Laptop", "Phone", "Tablet", "TV", "Appliance", "Other"];
const BRANDS = ["Aurea", "Nordic", "PixelPoint", "Voltbox", "Other"];

const PLANS = [
  {
    value: "standard",
    name: "Standard",
    priceLabel: "Included · 12 mo",
    description: "Manufacturer defect coverage from the purchase date.",
  },
  {
    value: "extended",
    name: "Extended",
    priceLabel: "৳1,200 · 24 mo",
    description: "Adds accidental damage and priority repair slots.",
  },
  {
    value: "premium",
    name: "Premium",
    priceLabel: "৳2,400 · 36 mo",
    description: "Full coverage plus one free screen or battery swap.",
  },
];

function Select({ label, id, options, value, onChange, required }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-neutral-900 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none bg-white border-2 border-neutral-900 rounded-md px-4 py-2.5 pr-10 text-sm text-neutral-900 transition-shadow duration-150 focus:outline-none focus:shadow-[3px_3px_0_0_#111827] cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#111827"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function RegisterProductPage() {
  const navigate = useNavigate();
  // TODO: replace with real authenticated user data
  const user = { firstName: "Ayan", lastName: "Rahman" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const [form, setForm] = useState({
    productName: "",
    category: CATEGORIES[0],
    brand: BRANDS[0],
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    purchasePrice: "",
    purchasedFrom: "",
  });
  const [plan, setPlan] = useState("standard");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your API — form fields and `plan` are in scope here.
    console.log("Register product", { ...form, plan });
    navigate("/dashboard/customer/products");
  };

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Back button */}
        <Link
          to="/dashboard/customer/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </Link>

        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <Link
            to="/dashboard/customer/products"
            className="font-semibold text-neutral-900 hover:text-amber-600 transition-colors duration-150"
          >
            My Products
          </Link>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-neutral-500">Register a product</span>
        </nav>

        {/* Page header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Register a product
        </h1>
        <p className="mt-2 text-neutral-600">
          Add your device's details to activate a digital warranty — no
          paper card needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Product details */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Product details
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              This information is matched against your invoice and brand
              records.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="productName"
                label="Product name"
                placeholder="e.g. Aurea A14 Laptop"
                required
                value={form.productName}
                onChange={handleChange("productName")}
              />
              <Select
                id="category"
                label="Category"
                options={CATEGORIES}
                value={form.category}
                onChange={handleChange("category")}
                required
              />

              <Select
                id="brand"
                label="Brand"
                options={BRANDS}
                value={form.brand}
                onChange={handleChange("brand")}
                required
              />
              <Input
                id="modelNumber"
                label="Model number"
                placeholder="e.g. A14-2026"
                required
                value={form.modelNumber}
                onChange={handleChange("modelNumber")}
              />

              <Input
                id="serialNumber"
                label="Serial number"
                placeholder="e.g. 8842-AX10-7731"
                required
                value={form.serialNumber}
                onChange={handleChange("serialNumber")}
              />
              <Input
                id="purchaseDate"
                label="Purchase date"
                type="date"
                required
                value={form.purchaseDate}
                onChange={handleChange("purchaseDate")}
              />

              <Input
                id="purchasePrice"
                label="Purchase price"
                type="number"
                placeholder="e.g. 85000"
                required
                value={form.purchasePrice}
                onChange={handleChange("purchasePrice")}
              />
              <Input
                id="purchasedFrom"
                label="Purchased from"
                placeholder="e.g. Aurea Electronics — Gulshan"
                required
                value={form.purchasedFrom}
                onChange={handleChange("purchasedFrom")}
              />
            </div>
          </Card>

          {/* Warranty plan */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Choose a warranty plan
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Standard coverage is included free with every registration.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {PLANS.map((p) => {
                const active = plan === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlan(p.value)}
                    aria-pressed={active}
                    className={`text-left rounded-lg border-2 border-neutral-900 p-4 transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 ${
                      active
                        ? "bg-emerald-200 shadow-[5px_5px_0_0_#111827]"
                        : "bg-white shadow-[3px_3px_0_0_#111827] hover:shadow-[6px_6px_0_0_#111827] hover:bg-amber-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-neutral-900 mb-3 ${
                        active ? "bg-neutral-900" : "bg-white"
                      }`}
                    >
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>

                    <h3 className="font-bold text-neutral-900 mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-600 mb-3">
                      {p.priceLabel}
                    </p>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Link
              to="/dashboard/customer/products"
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="glow"
              className="w-full sm:w-auto"
            >
              Register product
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}