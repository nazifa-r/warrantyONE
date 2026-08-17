import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import IconTile from "../../components/ui/IconTile";
import DashboardHeader from "../../components/customer/DashboardHeader";

// TODO: replace with real data from your API
const PRODUCTS = [
  {
    id: "8842-AX10-7731",
    category: "Laptop",
    brand: "Aurea",
    name: "Aurea A14 Laptop",
    serial: "8842-AX10-7731",
    registeredOn: "14 Mar 2026",
    expiresOn: "14 Mar 2028",
    purchasePrice: "125000",
    status: "active", // active | expiring | expired
  },
  {
    id: "2210-NX5-4402",
    category: "Phone",
    brand: "Nordic",
    name: "Nordic N5 Phone",
    serial: "2210-NX5-4402",
    registeredOn: "09 Sep 2025",
    expiresOn: "09 Sep 2026",
    purchasePrice: "45000",
    status: "expiring",
  },
  {
    id: "5567-PX2-1190",
    category: "Tablet",
    brand: "PixelPoint",
    name: "PixelPoint Tablet",
    serial: "5567-PX2-1190",
    registeredOn: "18 Jun 2024",
    expiresOn: "18 Jun 2025",
    purchasePrice: "32000",
    status: "expired",
  },
];

const STATUS_META = {
  active: { label: "Active", badgeVariant: "status" },
  expiring: { label: "30 days", badgeVariant: "warn" },
  expired: { label: "Expired", badgeVariant: "warn" },
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
];

export default function MyProductsPage() {
  // TODO: replace with real authenticated user data
  const user = { firstName: "Ayan", lastName: "Rahman" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filterCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length, active: 0, expiring: 0, expired: 0 };
    PRODUCTS.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesFilter = filter === "all" || p.status === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.serial.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Back button */}
        <Link
          to="/dashboard/customer"
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
          Back to dashboard
        </Link>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <Badge variant="eyebrow" className="block mb-2">
              Products
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              My products
            </h1>
          </div>
          <Link to="/dashboard/customer/products/register" className="w-full sm:w-auto">
            <Button variant="glow" className="w-full sm:w-auto">
              + Register a product
            </Button>
          </Link>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <Input
            id="product-search"
            placeholder="Search by name, serial number, or brand…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-full border-2 border-neutral-900 px-4 py-1.5 text-xs font-mono uppercase tracking-wide whitespace-nowrap transition-all duration-150 ease-out hover:-translate-y-0.5 ${
                    active
                      ? "bg-neutral-900 text-white shadow-[2px_2px_0_0_#111827]"
                      : "bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {f.label}
                  {f.value === "all" ? ` (${filterCounts.all})` : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-neutral-400 py-16 text-center text-neutral-500">
            <p className="font-medium mb-1">No products match your search.</p>
            <p className="text-sm">Try a different name, serial number, or filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const meta = STATUS_META[product.status];
              const isExpired = product.status === "expired";

              return (
                <Card
                  key={product.id}
                  className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]"
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">
                      {product.category} · {product.brand}
                    </span>
                    <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
                  </div>

                  <h3 className="text-lg font-bold mb-4">{product.name}</h3>

                  <dl className="space-y-1.5 text-sm mb-5">
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-500">Serial</dt>
                      <dd className="font-mono text-right break-all pl-2">
                        {product.serial}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-500">Registered</dt>
                      <dd className="font-mono">{product.registeredOn}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-500">
                        {isExpired ? "Expired" : "Expires"}
                      </dt>
                      <dd className="font-mono">{product.expiresOn}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-neutral-500">Price</dt>
                      <dd className="font-mono">৳{product.purchasePrice}</dd>
                    </div>
                  </dl>

                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/customer/products/${product.serial}`}
                      className="flex-1"
                    >
                      <Button variant="primary" className="w-full text-sm px-4 py-2">
                        View
                      </Button>
                    </Link>
                    <Link
                      to={
                        isExpired
                          ? `/dashboard/customer/products/${product.serial}/renew`
                          : `/dashboard/customer/products/${product.serial}/edit`
                      }
                      className="flex-1"
                    >
                      <Button variant="secondary" className="w-full text-sm px-4 py-2">
                        {isExpired ? "Renew" : "Edit"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}

            <Link
              to="/dashboard/customer/products/register"
              className="rounded-lg border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center gap-3 py-10 min-h-[200px] text-neutral-500 transition-all duration-200 ease-out hover:border-neutral-900 hover:text-neutral-900 hover:bg-white hover:shadow-[4px_4px_0_0_#111827] hover:-translate-x-1 hover:-translate-y-1"
            >
              <IconTile tone="dark" className="!bg-white !text-neutral-900">
                +
              </IconTile>
              <span className="text-sm font-medium">
                Register another product
              </span>
            </Link>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <p className="text-center text-sm text-neutral-500 mt-8">
            Showing {filteredProducts.length} of {PRODUCTS.length} registered
            products
          </p>
        )}
      </main>
    </div>
  );
}