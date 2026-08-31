import React from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { useAuth } from "../../context/AuthContext";

// Placeholder admin dashboard. Swap the static tiles below for real
// data (e.g. via new /api/customers, /api/products, /api/repairs
// summary calls) once the admin feature set is scoped out.
export default function AdminDashboardPage() {
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <Badge variant="eyebrow" className="block mb-2">
          Admin
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Admin dashboard
        </h1>
        <p className="text-neutral-600 mb-8">
          Welcome back, {user?.full_name || "Admin"}. This is a starting
          point — wire these tiles up to real endpoints as the admin
          feature set gets built out.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <span className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">
              Users
            </span>
            <h3 className="text-lg font-bold mt-2 mb-1">Manage users</h3>
            <p className="text-sm text-neutral-600">
              View and manage customer, retailer, and technician accounts.
            </p>
          </Card>

          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <span className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">
              Catalog
            </span>
            <h3 className="text-lg font-bold mt-2 mb-1">Brands & categories</h3>
            <p className="text-sm text-neutral-600">
              Add or edit the brands and categories products register under.
            </p>
          </Card>

          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <span className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">
              Warranty plans
            </span>
            <h3 className="text-lg font-bold mt-2 mb-1">Standard / Extended / Premium</h3>
            <p className="text-sm text-neutral-600">
              Already backed by <code className="font-mono text-xs">/api/warranties/plans</code>.
            </p>
          </Card>
        </div>

        <Card>
          <h2 className="font-semibold text-neutral-900 mb-1">Reports</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Cross-table queries — product ownership, category summaries,
            high-value customers, and more.
          </p>
          <Link to="/dashboard/analytics">
            <button className="inline-flex items-center gap-1.5 rounded-full border-2 border-neutral-900 px-4 py-2 text-xs font-mono uppercase tracking-wide bg-neutral-900 text-white transition-all duration-150 ease-out hover:-translate-y-0.5">
              Open Analytics →
            </button>
          </Link>
        </Card>
      </main>
    </div>
  );
}
