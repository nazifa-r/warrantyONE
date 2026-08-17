import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DashboardHeader from "../../components/customer/DashboardHeader";

const CATEGORIES = ["Laptop", "Phone", "Tablet", "TV", "Appliance", "Other"];
const BRANDS = ["Aurea", "Nordic", "PixelPoint", "Voltbox", "Other"];

// TODO: replace with a real fetch by serial number from your API.
// Kept in sync manually with ProductDetailPage.jsx for now — once a
// backend exists, both pages should read from the same source instead
// of two separate hardcoded objects.
const PRODUCTS_BY_SERIAL = {
  "8842-AX10-7731": {
    productName: "Aurea A14 Laptop",
    category: "Laptop",
    brand: "Aurea",
    modelNumber: "A14-2026",
    serialNumber: "8842-AX10-7731",
    purchaseDate: "2026-03-14",
    purchasePrice: "125000",
    purchasedFrom: "Aurea Electronics — Gulshan",
  },
  "2210-NX5-4402": {
    productName: "Nordic N5 Phone",
    category: "Phone",
    brand: "Nordic",
    modelNumber: "N5-2025",
    serialNumber: "2210-NX5-4402",
    purchaseDate: "2025-09-09",
    purchasePrice: "45000",
    purchasedFrom: "Nordic Home — Banani",
  },
  "5567-PX2-1190": {
    productName: "PixelPoint Tablet",
    category: "Tablet",
    brand: "PixelPoint",
    modelNumber: "PX2-2024",
    serialNumber: "5567-PX2-1190",
    purchaseDate: "2024-06-18",
    purchasePrice: "32000",
    purchasedFrom: "PixelPoint Store — Mirpur",
  },
};

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

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockedField({ label, value }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 mb-2">
        {label}
        <span className="text-neutral-400">
          <LockIcon />
        </span>
      </label>
      <div className="w-full bg-neutral-100 border-2 border-neutral-300 rounded-md px-4 py-2.5 text-sm text-neutral-500 font-mono cursor-not-allowed select-none">
        {value}
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const { serial } = useParams();
  const navigate = useNavigate();
  // TODO: replace with real authenticated user data
  const user = { firstName: "Ayan", lastName: "Rahman" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const existing = PRODUCTS_BY_SERIAL[serial];
  const [form, setForm] = useState(
    existing || {
      productName: "",
      category: CATEGORIES[0],
      brand: BRANDS[0],
      modelNumber: "",
      serialNumber: serial || "",
      purchaseDate: "",
      purchasePrice: "",
      purchasedFrom: "",
    }
  );

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your API — form fields are in scope here.
    // modelNumber and serialNumber are locked and always
    // submitted as their original values.
    console.log("Update product", form);
    navigate(`/dashboard/customer/products/${form.serialNumber}`);
  };

  if (!existing) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-neutral-600 mb-6">
            We couldn't find a registered product with serial{" "}
            <span className="font-mono">{serial}</span> to edit.
          </p>
          <Link to="/dashboard/customer/products">
            <Button variant="primary">Back to my products</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Back button */}
        <Link
          to={`/dashboard/customer/products/${serial}`}
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
          Back to product
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
          <Link
            to={`/dashboard/customer/products/${serial}`}
            className="font-semibold text-neutral-900 hover:text-amber-600 transition-colors duration-150"
          >
            {existing.productName}
          </Link>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-neutral-500">Edit</span>
        </nav>

        {/* Page header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Edit product details
        </h1>
        <p className="mt-2 text-neutral-600">
          Update your device's information. This won't affect your existing
          warranty coverage.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Product details
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Fields locked are tied to your
              original invoice and can't be changed. Contact support if any
              of these are incorrect.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="productName"
                label="Product name"
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
              <LockedField label="Model number" value={form.modelNumber} />

              <LockedField label="Serial number" value={form.serialNumber} />
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
                required
                value={form.purchasedFrom}
                onChange={handleChange("purchasedFrom")}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Link
              to={`/dashboard/customer/products/${serial}`}
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
            <Button type="submit" variant="glow" className="w-full sm:w-auto">
              Save changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}