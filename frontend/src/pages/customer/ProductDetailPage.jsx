import React from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DashboardHeader from "../../components/customer/DashboardHeader";

// TODO: replace with a real fetch by serial number from your API.
const PRODUCTS_BY_SERIAL = {
  "8842-AX10-7731": {
    name: "Aurea A14 Laptop",
    category: "Laptop",
    brand: "Aurea",
    status: "active",
    modelNumber: "A14-2026",
    serial: "8842-AX10-7731",
    purchaseDate: "14 Mar 2026",
    purchasePrice: "125000",
    purchasedFrom: "Aurea Electronics — Gulshan",
    owner: "Ayan Rahman",
    warranty: {
      plan: "Extended Plan",
      startDate: "14 Mar 2026",
      endDate: "14 Mar 2028",
      status: "Verified",
    },
    repairsCompleted: 1,
    daysOfCoverageLeft: 570,
    nextCheck: {
      date: "14 Sep 2026",
      label: "Battery health review",
    },
    repairHistory: [
      {
        date: "02 Jul 2026",
        issue: "Battery not charging fully",
        serviceCenter: "Center 3 — Dhanmondi",
        status: "Completed",
        statusVariant: "status",
      },
    ],
  },
  "2210-NX5-4402": {
    name: "Nordic N5 Phone",
    category: "Phone",
    brand: "Nordic",
    status: "expiring",
    modelNumber: "N5-2025",
    serial: "2210-NX5-4402",
    purchaseDate: "09 Sep 2025",
    purchasePrice: "45000",
    purchasedFrom: "Nordic Home — Banani",
    owner: "Ayan Rahman",
    warranty: {
      plan: "Standard Plan",
      startDate: "09 Sep 2025",
      endDate: "09 Sep 2026",
      status: "Verified",
    },
    repairsCompleted: 1,
    daysOfCoverageLeft: 23,
    nextCheck: null,
    repairHistory: [
      {
        date: "02 Jul 2026",
        issue: "Cracked screen",
        serviceCenter: "Center 1 — Uttara",
        status: "Completed",
        statusVariant: "status",
      },
    ],
  },
  "5567-PX2-1190": {
    name: "PixelPoint Tablet",
    category: "Tablet",
    brand: "PixelPoint",
    status: "expired",
    modelNumber: "PX2-2024",
    serial: "5567-PX2-1190",
    purchaseDate: "18 Jun 2024",
    purchasePrice: "32000",
    purchasedFrom: "PixelPoint Store — Mirpur",
    owner: "Ayan Rahman",
    warranty: {
      plan: "Standard Plan",
      startDate: "18 Jun 2024",
      endDate: "18 Jun 2025",
      status: "Expired",
    },
    repairsCompleted: 0,
    daysOfCoverageLeft: 0,
    nextCheck: null,
    repairHistory: [],
  },
};

const STATUS_BADGE = {
  active: { label: "Active", variant: "status" },
  expiring: { label: "Expiring soon", variant: "warn" },
  expired: { label: "Expired", variant: "warn" },
};

export default function ProductDetailPage() {
  const { serial } = useParams();
  // TODO: replace with real authenticated user data
  const user = { firstName: "Ayan", lastName: "Rahman" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const product = PRODUCTS_BY_SERIAL[serial];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-neutral-600 mb-6">
            We couldn't find a registered product with serial{" "}
            <span className="font-mono">{serial}</span>.
          </p>
          <Link to="/dashboard/customer/products">
            <Button variant="primary">Back</Button>
          </Link>
        </main>
      </div>
    );
  }

  const statusBadge = STATUS_BADGE[product.status];
  const isExpired = product.status === "expired";

  const handleDelete = () => {
    // TODO: wire up delete confirmation + API call
    console.log("Delete product", product.serial);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
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
          <span className="text-neutral-500">{product.name}</span>
        </nav>

        {/* Title + actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/dashboard/customer/products/${product.serial}/${
                isExpired ? "renew" : "extend"
              }`}
              className="flex-1 sm:flex-none"
            >
              <Button variant="glow" className="w-full sm:w-auto">
                {isExpired ? "Renew warranty" : "Choose a warranty plan"}
              </Button>
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium border-2 border-neutral-900 bg-red-200 text-neutral-900 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-red-400 hover:shadow-[6px_6px_0_0_#111827] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
          {/* Left column */}
          <div className="space-y-5">
            {/* Product details */}
            <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
              <h2 className="font-semibold text-neutral-900 mb-5">
                Product details
              </h2>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-5 text-sm">
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Model number
                  </dt>
                  <dd className="font-mono break-all">{product.modelNumber}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Serial number
                  </dt>
                  <dd className="font-mono break-all">{product.serial}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Category
                  </dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Brand
                  </dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Purchase date
                  </dt>
                  <dd>{product.purchaseDate}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Purchase price
                  </dt>
                  <dd className="font-mono">৳{product.purchasePrice}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Purchased from
                  </dt>
                  <dd>{product.purchasedFrom}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Owner
                  </dt>
                  <dd>{product.owner}</dd>
                </div>
              </dl>
            </Card>

            {/* Repair history */}
            <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
              <div className="flex items-center justify-between mb-5 gap-2">
                <h2 className="font-semibold text-neutral-900">
                  Repair history
                </h2>
                <Link
                  to={`/dashboard/customer/repairs/new?product=${product.serial}`}
                  className="text-sm font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors duration-150 whitespace-nowrap"
                >
                  Request repair →
                </Link>
              </div>

              {product.repairHistory.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">
                  No repair records for this product.
                </p>
              ) : (
                <>
                  {/* Mobile: stacked cards */}
                  <div className="sm:hidden space-y-3">
                    {product.repairHistory.map((repair) => (
                      <div
                        key={repair.date + repair.issue}
                        className="rounded-lg border-2 border-neutral-900 bg-white p-4 transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#111827]"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-medium text-sm">{repair.issue}</span>
                          <Badge variant={repair.statusVariant}>
                            {repair.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-600">
                          {repair.serviceCenter}
                        </p>
                        <p className="text-xs font-mono text-neutral-500 mt-1">
                          {repair.date}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tablet+: table */}
                  <div className="hidden sm:block rounded-lg border-2 border-neutral-900 overflow-x-auto">
                    <table className="w-full text-sm min-w-[520px]">
                      <thead>
                        <tr className="bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide">
                          <th className="text-left px-4 py-3 font-medium">Date</th>
                          <th className="text-left px-4 py-3 font-medium">Issue</th>
                          <th className="text-left px-4 py-3 font-medium">
                            Service center
                          </th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {product.repairHistory.map((repair, i) => (
                          <tr
                            key={repair.date + repair.issue}
                            className={`transition-colors duration-150 hover:bg-amber-50 ${
                              i !== product.repairHistory.length - 1
                                ? "border-b border-neutral-200"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-3 font-mono text-neutral-700">
                              {repair.date}
                            </td>
                            <td className="px-4 py-3">{repair.issue}</td>
                            <td className="px-4 py-3 text-neutral-700">
                              {repair.serviceCenter}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={repair.statusVariant}>
                                {repair.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Warranty card */}
            <div className="bg-neutral-900 text-white border-2 border-neutral-900 rounded-lg p-6 shadow-[4px_4px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[0_14px_32px_-8px_rgba(251,191,36,0.45)] hover:border-amber-300">
              <span className="text-[11px] font-mono uppercase tracking-wide text-amber-300">
                Digital warranty
              </span>
              <h3 className="text-xl font-bold mt-2 mb-5">
                {product.warranty.plan}
              </h3>

              <dl className="space-y-3 border-t border-white/10 pt-4 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Start date</dt>
                  <dd className="font-mono">{product.warranty.startDate}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">End date</dt>
                  <dd className="font-mono">{product.warranty.endDate}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Status</dt>
                  <dd>{product.warranty.status}</dd>
                </div>
              </dl>

              <Button variant="accent" className="w-full justify-center">
                Download warranty card
              </Button>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-lg border-2 border-neutral-900 bg-white px-4 sm:px-5 py-4 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] hover:bg-emerald-50 cursor-default">
                <div className="text-2xl sm:text-3xl font-bold">
                  {product.repairsCompleted}
                </div>
                <div className="text-xs sm:text-sm text-neutral-700 mt-1">
                  Repairs completed
                </div>
              </div>
              <div className="rounded-lg border-2 border-neutral-900 bg-white px-4 sm:px-5 py-4 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] hover:bg-amber-50 cursor-default">
                <div className="text-2xl sm:text-3xl font-bold">
                  {product.daysOfCoverageLeft}
                </div>
                <div className="text-xs sm:text-sm text-neutral-700 mt-1">
                  Days of coverage left
                </div>
              </div>
            </div>

            {/* Maintenance reminders */}
            <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
              <h3 className="font-semibold text-neutral-900 mb-4">
                Maintenance reminders
              </h3>
              {product.nextCheck ? (
                <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Next scheduled check
                  </p>
                  <p className="text-sm">
                    {product.nextCheck.date} — {product.nextCheck.label}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  No upcoming maintenance reminders for this product.
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}