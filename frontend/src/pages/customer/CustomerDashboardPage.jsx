import React from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import IconTile from "../../components/ui/IconTile";
import DashboardHeader from "../../components/customer/DashboardHeader";

const STATS = [
  { label: "Registered products", value: 3, tone: "plain" },
  { label: "Active warranties", value: 2, tone: "coral" },
  { label: "Repair in progress", value: 1, tone: "plain" },
  { label: "Expiring within 30 days", value: 1, tone: "mint" },
];

const STAT_TONE_CLASSES = {
  plain: "bg-white",
  coral: "bg-orange-200",
  mint: "bg-emerald-200",
};

const PRODUCTS = [
  {
    category: "Laptop",
    brand: "Aurea",
    name: "Aurea A14 Laptop",
    serial: "8842-AX10-7731",
    expires: "14 Mar 2028",
    badge: { label: "Active", variant: "status" },
  },
  {
    category: "Phone",
    brand: "Nordic",
    name: "Nordic N5 Phone",
    serial: "2210-NX5-4402",
    expires: "09 Sep 2026",
    badge: { label: "30 days Remaining", variant: "warn" },
  },
];

const REPAIRS = [
  {
    product: "Aurea A14 Laptop",
    issue: "Battery not charging",
    requested: "12 Aug 2026",
    status: "In progress",
    statusVariant: "warn",
    action: "Track",
  },
  {
    product: "Nordic N5 Phone",
    issue: "Cracked screen",
    requested: "02 Jul 2026",
    status: "Completed",
    statusVariant: "status",
    action: "View",
  },
  {
    product: "PixelPoint Tablet",
    issue: "Won't power on",
    requested: "29 Jun 2026",
    status: "Awaiting parts",
    statusVariant: "warn",
    action: "Track",
  },
];

export default function CustomerDashboardPage() {
  // TODO: replace with real authenticated user data
  const user = { firstName: "Ayan", lastName: "Rahman" };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Badge variant="eyebrow" className="block mb-2">
                Customer dashboard
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Welcome back, {user.firstName}.
              </h1>
            </div>
            <Link to="/dashboard/customer/products/register" className="w-full sm:w-auto">
              <Button variant="glow" className="w-full sm:w-auto">
                + Register a product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg border-2 border-neutral-900 px-4 sm:px-5 py-4 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] cursor-default ${STAT_TONE_CLASSES[stat.tone]}`}
            >
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <div className="text-xs sm:text-sm text-neutral-700 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Your products */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Your products</h2>
            <Link
              to="/dashboard/customer/products"
              className="text-sm font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
            >
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PRODUCTS.map((product) => (
              <Card
                key={product.serial}
                className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]"
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">
                    {product.category} · {product.brand}
                  </span>
                  <Badge variant={product.badge.variant}>
                    {product.badge.label}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold mb-4">{product.name}</h3>

                <dl className="space-y-1.5 text-sm mb-5">
                  <div className="flex items-center justify-between">
                    <dt className="text-neutral-500">Serial</dt>
                    <dd className="font-mono text-right break-all pl-2">{product.serial}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-neutral-500">Expires</dt>
                    <dd className="font-mono">{product.expires}</dd>
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
                    to={`/dashboard/customer/products/${product.serial}/edit`}
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full text-sm px-4 py-2">
                      Edit
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

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
        </section>

        {/* Recent repair requests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Recent repair requests</h2>
            <Link
              to="/dashboard/customer/repairs"
              className="text-sm font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
            >
              View all →
            </Link>
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {REPAIRS.map((repair) => (
              <div
                key={repair.product + repair.requested}
                className="rounded-lg border-2 border-neutral-900 bg-white p-4 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#111827]"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium">{repair.product}</span>
                  <Badge variant={repair.statusVariant}>{repair.status}</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-1">{repair.issue}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-mono text-neutral-500">
                    {repair.requested}
                  </span>
                  <Link
                    to={`/dashboard/customer/repairs/${encodeURIComponent(repair.product)}`}
                    className="text-sm font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
                  >
                    {repair.action} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet+: table, horizontally scrollable if needed */}
          <div className="hidden sm:block rounded-lg border-2 border-neutral-900 overflow-x-auto shadow-[3px_3px_0_0_#111827]">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Issue</th>
                  <th className="text-left px-5 py-3 font-medium">
                    Requested
                  </th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {REPAIRS.map((repair, i) => (
                  <tr
                    key={repair.product + repair.requested}
                    className={`transition-colors duration-150 hover:bg-amber-50 ${
                      i !== REPAIRS.length - 1 ? "border-b border-neutral-200" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-medium">
                      {repair.product}
                    </td>
                    <td className="px-5 py-4 text-neutral-700">
                      {repair.issue}
                    </td>
                    <td className="px-5 py-4 font-mono text-neutral-700">
                      {repair.requested}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={repair.statusVariant}>
                        {repair.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/customer/repairs/${encodeURIComponent(repair.product)}`}
                        className="font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
                      >
                        {repair.action}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}