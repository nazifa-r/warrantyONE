import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import DashboardHeader from "../components/customer/DashboardHeader";
import { analyticsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Renders one report's rows as a simple table. `columns` is
// [{ key, label }] so each section can shape its own data.
function ReportTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <p className="text-sm text-neutral-500 py-6 text-center">
        No rows returned for this query.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-neutral-900">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-2 pr-4 font-mono text-xs uppercase tracking-wide text-neutral-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-neutral-200">
              {columns.map((col) => (
                <td key={col.key} className="py-2 pr-4 text-neutral-800">
                  {row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Extracts a specific key out of the { overall, byCategory } shape
// returned by /analytics/above-average-products, so it can slot into
// the same SECTIONS/fetch loop as every other (flat-array) report.
const pickAboveAverage = (subKey) => async () => {
  const res = await analyticsAPI.getAboveAverageProducts();
  return { data: { data: res.data.data[subKey] } };
};

const SECTIONS = [
  {
    key: "productOwnership",
    title: "Product ownership",
    operation: "JOIN",
    description: "Every registered product joined with its category, brand, and owning customer.",
    fetcher: () => analyticsAPI.getProductOwnership(),
    columns: [
      { key: "product_name", label: "Product" },
      { key: "category_name", label: "Category" },
      { key: "brand_name", label: "Brand" },
      { key: "customer_name", label: "Customer" },
      { key: "purchase_date", label: "Purchased" },
    ],
  },
  {
    key: "customerCounts",
    title: "Customers & product counts",
    operation: "LEFT JOIN",
    description: "Every customer, including ones with zero registered products.",
    fetcher: () => analyticsAPI.getCustomerProductCounts(),
    columns: [
      { key: "customer_name", label: "Customer" },
      { key: "email", label: "Email" },
      { key: "product_count", label: "Products" },
    ],
  },
  {
    key: "attentionNeeded",
    title: "Needs attention",
    operation: "UNION",
    description: "Products with a warranty expiring within 30 days, combined with products under active repair.",
    fetcher: () => analyticsAPI.getAttentionNeeded(),
    columns: [
      { key: "product_name", label: "Product" },
      { key: "serial_number", label: "Serial" },
      { key: "reason", label: "Reason" },
      { key: "relevant_date", label: "Date" },
    ],
  },
  {
    key: "engagedPremium",
    title: "Engaged premium customers",
    operation: "INTERSECT",
    description: "Customers who hold a paid plan (Extended/Premium) AND have filed at least one repair.",
    fetcher: () => analyticsAPI.getEngagedPremiumCustomers(),
    columns: [
      { key: "customer_name", label: "Customer" },
      { key: "email", label: "Email" },
    ],
  },
  {
    key: "troubleFree",
    title: "Trouble-free products",
    operation: "EXCEPT",
    description: "Registered products that have never had a repair filed.",
    fetcher: () => analyticsAPI.getTroubleFreeProducts(),
    columns: [
      { key: "product_name", label: "Product" },
      { key: "serial_number", label: "Serial" },
      { key: "brand_name", label: "Brand" },
      { key: "customer_name", label: "Customer" },
    ],
  },
  {
    key: "categorySummary",
    title: "Category summary",
    operation: "GROUP BY",
    description: "Products grouped by category, with count, total value, and average price per group.",
    fetcher: () => analyticsAPI.getCategorySummary(),
    columns: [
      { key: "category_name", label: "Category" },
      { key: "product_count", label: "Products" },
      { key: "total_value", label: "Total value (৳)" },
      { key: "avg_price", label: "Avg price (৳)" },
    ],
  },
  {
    key: "highValueCustomers",
    title: "High-value customers",
    operation: "AGGREGATE + HAVING",
    description: "Customers whose total spend exceeds ৳50,000, with a conditional count of their pending repairs.",
    fetcher: () => analyticsAPI.getHighValueCustomers(),
    columns: [
      { key: "customer_name", label: "Customer" },
      { key: "product_count", label: "Products" },
      { key: "total_spent", label: "Total spent (৳)" },
      { key: "pending_repairs", label: "Pending repairs" },
    ],
  },
  {
    key: "aboveAverageOverall",
    title: "Above-average priced products (overall)",
    operation: "SUBQUERY",
    description: "Products priced above the average price across all products (plain scalar subquery).",
    fetcher: pickAboveAverage("overall"),
    columns: [
      { key: "product_name", label: "Product" },
      { key: "category_name", label: "Category" },
      { key: "brand_name", label: "Brand" },
      { key: "purchase_price", label: "Price (৳)" },
    ],
  },
  {
    key: "aboveAverageByCategory",
    title: "Above-average priced products (by category)",
    operation: "SUBQUERY",
    description: "Products priced above their own category's average (correlated subquery — recomputed per row).",
    fetcher: pickAboveAverage("byCategory"),
    columns: [
      { key: "product_name", label: "Product" },
      { key: "category_name", label: "Category" },
      { key: "purchase_price", label: "Price (৳)" },
    ],
  },
];

const OPERATION_BADGE = {
  JOIN: "status",
  "LEFT JOIN": "status",
  UNION: "warn",
  INTERSECT: "warn",
  EXCEPT: "warn",
  "GROUP BY": "status",
  "AGGREGATE + HAVING": "warn",
  SUBQUERY: "warn",
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");
        const results = await Promise.all(SECTIONS.map((s) => s.fetcher()));
        const next = {};
        SECTIONS.forEach((s, i) => {
          next[s.key] = results[i].data.data;
        });
        setData(next);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(
          err.response?.status === 403
            ? "Analytics reports are restricted to Admin and Retailer accounts."
            : "Failed to load analytics. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <Link
          to="/dashboard/customer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150 mb-4"
        >
          ← Back to dashboard
        </Link>

        <Badge variant="eyebrow" className="block mb-2">
          Reports
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Analytics
        </h1>
        <p className="text-neutral-600 mb-8">
          Queries across the WarrantyOne schema, each demonstrating a
          different relational or SQL concept.
        </p>

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-600">Running queries...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <Card key={section.key}>
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h2 className="font-semibold text-neutral-900">{section.title}</h2>
                  <Badge variant={OPERATION_BADGE[section.operation] || "status"}>
                    {section.operation}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500 mb-4">{section.description}</p>
                <ReportTable columns={section.columns} rows={data[section.key]} />
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
