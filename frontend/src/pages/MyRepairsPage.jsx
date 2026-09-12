import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { repairAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const STATUS_META = {
  Pending:     { key: "pending",     label: "Pending",       variant: "plain" },
  In_Progress: { key: "in-progress", label: "In progress",   variant: "warn" },
  Completed:   { key: "completed",   label: "Completed",     variant: "status" },
  Cancelled:   { key: "cancelled",   label: "Cancelled",     variant: "warn" },
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

// What action link to show per status
const getAction = (repair) => {
  const key = STATUS_META[repair.status]?.key;
  if (key === "pending") return { label: "Edit", to: `/dashboard/customer/repairs/${repair.repair_id}/edit`, secondary: "Cancel" };
  if (key === "completed") return { label: "View", to: `/dashboard/customer/repairs/${repair.repair_id}/edit` };
  return { label: "Track", to: `/dashboard/customer/repairs/${repair.repair_id}/edit` };
};

export default function MyRepairsPage() {
  const { user } = useAuth();
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const res = await repairAPI.getAll();
      if (res.data.success) {
        setRepairs(res.data.data);
      } else {
        setError("Failed to load repairs");
      }
    } catch (err) {
      console.error("Error fetching repairs:", err);
      setError("Failed to load repairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleCancel = async (repairId) => {
    if (!window.confirm("Cancel this repair request? This can't be undone.")) return;
    setCancellingId(repairId);
    try {
      await repairAPI.cancel(repairId);
      fetchRepairs();
    } catch (err) {
      console.error("Error cancelling repair:", err);
      window.alert(err.response?.data?.message || "Failed to cancel repair request.");
    } finally {
      setCancellingId(null);
    }
  };

  const filterCounts = useMemo(() => {
    const counts = { all: repairs.length, pending: 0, "in-progress": 0, completed: 0 };
    repairs.forEach((r) => {
      const key = STATUS_META[r.status]?.key;
      if (key && counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [repairs]);

  const filteredRepairs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repairs.filter((r) => {
      const key = STATUS_META[r.status]?.key || "pending";
      const matchesFilter = filter === "all" || key === filter;
      const matchesQuery =
        !q ||
        r.product_name?.toLowerCase().includes(q) ||
        r.issue_type?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [repairs, query, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading repair requests...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div>
            <Badge variant="eyebrow" className="block mb-2">Repairs</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My repair requests</h1>
          </div>
          <Link to="/dashboard/customer/repairs/new">
            <Button variant="glow">+ Request a repair</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Search + filters */}
        <Card className="!p-0 overflow-hidden mb-5">
          <div className="p-4 sm:p-5 border-b-2 border-neutral-200">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <div className="flex-1">
                <Input
                  id="repair-search"
                  placeholder="Search by product or issue…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => {
                  const active = filter === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      aria-pressed={active}
                      className={`rounded-full border-2 border-neutral-900 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wide whitespace-nowrap transition-all duration-150 ease-out hover:-translate-y-0.5 ${
                        active
                          ? "bg-neutral-900 text-white shadow-[2px_2px_0_0_#111827]"
                          : "bg-white text-neutral-700 hover:bg-amber-50 hover:shadow-[2px_2px_0_0_#111827]"
                      }`}
                    >
                      {item.label} ({filterCounts[item.value] || 0})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {filteredRepairs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="font-bold mb-1">No repair requests found</h2>
              <p className="text-sm text-neutral-500">
                Try another search term or choose a different status filter.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: cards */}
              <div className="md:hidden divide-y-2 divide-neutral-200">
                {filteredRepairs.map((repair) => {
                  const meta = STATUS_META[repair.status] || STATUS_META.Pending;
                  const action = getAction(repair);
                  return (
                    <div key={repair.repair_id} className="bg-white p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{repair.product_name}</h3>
                          <p className="text-sm text-neutral-600 mt-0.5">{repair.issue_type}</p>
                        </div>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className="text-xs font-mono text-neutral-500">
                          Requested {formatDate(repair.request_date)}
                        </span>
                        <div className="flex items-center gap-3">
                          <Link
                            to={action.to}
                            className="text-sm font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors duration-150"
                          >
                            {action.label}
                          </Link>
                          {action.secondary && (
                            <button
                              type="button"
                              disabled={cancellingId === repair.repair_id}
                              onClick={() => handleCancel(repair.repair_id)}
                              className="text-sm font-semibold text-neutral-400 underline underline-offset-2 hover:text-red-500 transition-colors duration-150 disabled:opacity-50"
                            >
                              {cancellingId === repair.repair_id ? "Cancelling..." : action.secondary}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                  <thead>
                    <tr className="bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide">
                      <th className="text-left px-5 py-3 font-medium">Product</th>
                      <th className="text-left px-5 py-3 font-medium">Issue</th>
                      <th className="text-left px-5 py-3 font-medium">Requested</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-right px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredRepairs.map((repair, index) => {
                      const meta = STATUS_META[repair.status] || STATUS_META.Pending;
                      const action = getAction(repair);
                      return (
                        <tr
                          key={repair.repair_id}
                          className={`group transition-colors duration-150 hover:bg-amber-50 ${
                            index !== filteredRepairs.length - 1 ? "border-b border-neutral-200" : ""
                          }`}
                        >
                          <td className="px-5 py-4 font-medium">{repair.product_name}</td>
                          <td className="px-5 py-4 text-neutral-700">{repair.issue_type}</td>
                          <td className="px-5 py-4 font-mono text-neutral-700">
                            {formatDate(repair.request_date)}
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant={meta.variant}>{meta.label}</Badge>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-3">
                              <Link
                                to={action.to}
                                className="font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors duration-150"
                              >
                                {action.label}
                              </Link>
                              {action.secondary && (
                                <button
                                  type="button"
                                  disabled={cancellingId === repair.repair_id}
                                  className="font-semibold text-neutral-400 underline underline-offset-2 hover:text-red-500 transition-colors duration-150 disabled:opacity-50"
                                  onClick={() => handleCancel(repair.repair_id)}
                                >
                                  {cancellingId === repair.repair_id ? "Cancelling..." : action.secondary}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>

        <div className="text-sm text-neutral-500">
          Showing {filteredRepairs.length} of {repairs.length} repair requests
        </div>
      </main>
    </div>
  );
}
