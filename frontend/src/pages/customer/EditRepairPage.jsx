import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { repairAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ISSUE_TYPES = [
  "Battery replacement",
  "Screen damage",
  "Won't power on",
  "Overheating",
  "Software issue",
  "Physical damage",
  "Other",
];

function TextArea({ label, id, value, onChange, required, placeholder, rows = 4, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full border-2 border-neutral-900 rounded-md px-4 py-2.5 text-sm text-neutral-900 transition-shadow duration-150 focus:outline-none focus:shadow-[3px_3px_0_0_#111827] resize-y disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500"
      />
    </div>
  );
}

function Select({ label, id, options, value, onChange, required, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full appearance-none bg-white border-2 border-neutral-900 rounded-md px-4 py-2.5 pr-10 text-sm text-neutral-900 transition-shadow duration-150 focus:outline-none focus:shadow-[3px_3px_0_0_#111827] cursor-pointer disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500"
        >
          <option value="">Select an issue type</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          width="12" height="8" viewBox="0 0 12 8" fill="none"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const STATUS_BADGE = {
  Pending: "plain",
  In_Progress: "warn",
  Completed: "status",
  Cancelled: "warn",
};

export default function EditRepairPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ issue_type: "", issue_description: "" });

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  const isEditable = repair?.status === "Pending";

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        setLoading(true);
        const res = await repairAPI.getById(id);
        if (res.data.success) {
          const r = res.data.data;
          setRepair(r);
          setForm({ issue_type: r.issue_type || "", issue_description: r.issue_description || "" });
        } else {
          setError("Repair request not found");
        }
      } catch (err) {
        console.error("Error fetching repair:", err);
        setError(err.response?.data?.message || "Failed to load repair request");
      } finally {
        setLoading(false);
      }
    };
    fetchRepair();
  }, [id]);

  const handleChange = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!form.issue_type) {
      setError("Please select an issue type.");
      setSaving(false);
      return;
    }

    try {
      const res = await repairAPI.update(id, form);
      if (res.data.success) {
        setRepair(res.data.data);
        setSuccess("Repair request updated successfully!");
        setTimeout(() => navigate("/dashboard/customer/repairs"), 1200);
      } else {
        setError(res.data.message || "Failed to update repair request");
      }
    } catch (err) {
      console.error("Error updating repair:", err);
      setError(err.response?.data?.message || "Failed to update repair request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this repair request? This can't be undone.")) return;
    setCancelling(true);
    setError("");
    try {
      const res = await repairAPI.cancel(id);
      if (res.data.success) {
        navigate("/dashboard/customer/repairs");
      } else {
        setError(res.data.message || "Failed to cancel repair request");
      }
    } catch (err) {
      console.error("Error cancelling repair:", err);
      setError(err.response?.data?.message || "Failed to cancel repair request. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading repair request...</p>
        </main>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Repair request not found</h1>
          <p className="text-neutral-600 mb-6">{error || "This repair request doesn't exist or you don't have access to it."}</p>
          <Link to="/dashboard/customer/repairs">
            <Button variant="primary">Back to my repairs</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <Link
          to="/dashboard/customer/repairs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to my repairs
        </Link>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {isEditable ? "Edit repair request" : "Repair request"}
          </h1>
          <Badge variant={STATUS_BADGE[repair.status] || "plain"}>
            {repair.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-neutral-600 mb-6">
          {repair.product_name} · Serial <span className="font-mono">{repair.serial_number}</span>
        </p>

        {!isEditable && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              This request is {repair.status === "Cancelled" ? "cancelled" : "already being handled"} and
              can no longer be edited or cancelled.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className={isEditable ? "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]" : "opacity-70"}>
            <h2 className="font-semibold text-neutral-900 mb-1">Issue details</h2>
            <p className="text-sm text-neutral-500 mb-6">
              {isEditable
                ? "Update what's wrong — a technician will use this to prep before your appointment."
                : "These details are locked once a technician picks up the request."}
            </p>

            <div className="space-y-5">
              <Select
                id="issue_type"
                label="Issue type"
                options={ISSUE_TYPES}
                value={form.issue_type}
                onChange={handleChange("issue_type")}
                required
                disabled={!isEditable}
              />
              <TextArea
                id="issue_description"
                label="Description"
                placeholder="Describe the issue in more detail..."
                value={form.issue_description}
                onChange={handleChange("issue_description")}
                disabled={!isEditable}
              />
            </div>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            {isEditable ? (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling || saving}
                className="text-sm font-semibold text-red-500 underline underline-offset-2 hover:text-red-700 transition-colors duration-150 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel this repair request"}
              </button>
            ) : <span />}

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
              <Link to="/dashboard/customer/repairs" className="w-full sm:w-auto">
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Back
                </Button>
              </Link>
              {isEditable && (
                <Button type="submit" variant="glow" className="w-full sm:w-auto" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
