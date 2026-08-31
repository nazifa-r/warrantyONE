import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI, repairAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ISSUE_TYPES = [
  "Battery / charging",
  "Screen / display",
  "Power / startup",
  "Performance",
  "Software / operating system",
  "Keyboard / buttons",
  "Camera / audio",
  "Physical damage",
  "Other",
];

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4.1 4.1 0 0 0-5.4 5.4L3.8 17.2a2 2 0 1 0 2.8 2.8l5.5-5.5a4.1 4.1 0 0 0 5.4-5.4l-2.5 2.5-2.6-.5-.5-2.6 2.8-2.2 2.5 2.5Z" />
    </svg>
  );
}

function SelectField({ label, id, value, onChange, options, required = false, helper }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-neutral-900 mb-2">
        {label}
        {required && <span className="text-amber-600 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full appearance-none bg-white border-2 border-neutral-900 rounded-md px-4 py-2.5 pr-10 text-sm text-neutral-900 transition-all duration-150 hover:bg-amber-50 focus:outline-none focus:shadow-[3px_3px_0_0_#111827] cursor-pointer"
        >
          {options.map((option) => {
            const item = typeof option === "string" ? { value: option, label: option } : option;
            return <option key={item.value} value={item.value}>{item.label}</option>;
          })}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
          <ChevronIcon />
        </span>
      </div>
      {helper && <p className="mt-1.5 text-xs text-neutral-500">{helper}</p>}
    </div>
  );
}

export default function RequestRepairPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  const productFromUrl = searchParams.get("product");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({
    issueType: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createdRepairId, setCreatedRepairId] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productFromUrl) {
        setLoadError("No product specified.");
        setLoadingProduct(false);
        return;
      }
      try {
        setLoadingProduct(true);
        const res = await productAPI.getBySerial(productFromUrl);
        if (res.data.success) {
          setSelectedProduct(res.data.data);
        } else {
          setLoadError("Product not found.");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setLoadError("Product not found.");
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productFromUrl]);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const canSubmit =
    selectedProduct &&
    form.issueType &&
    form.description.trim().length >= 10;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const res = await repairAPI.create({
        product_id: selectedProduct.product_id,
        issue_type: form.issueType,
        issue_description: form.description.trim(),
      });

      if (res.data.success) {
        setCreatedRepairId(res.data.data.repair_id);
        setSubmitted(true);
        setTimeout(() => {
          navigate("/dashboard/customer/repairs");
        }, 1200);
      } else {
        setSubmitError(res.data.message || "Failed to submit repair request.");
      }
    } catch (err) {
      console.error("Error submitting repair request:", err);
      setSubmitError(err.response?.data?.message || "Failed to submit repair request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading product...</p>
        </main>
      </div>
    );
  }

  if (loadError || !selectedProduct) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-neutral-600 mb-6">{loadError}</p>
          <Link to="/dashboard/customer/products">
            <Button variant="primary">Back to my products</Button>
          </Link>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <Card className="text-center border-2 border-neutral-900 shadow-[5px_5px_0_0_#111827]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-neutral-900 bg-emerald-200">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <Badge variant="eyebrow" className="mb-3">Request submitted</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold">Your repair request is on its way</h1>
            <p className="text-neutral-600 mt-3">
              We've logged your request against {selectedProduct.product_name}. It's now pending review.
            </p>
            {createdRepairId && (
              <p className="font-mono text-sm mt-4">Repair ID: {createdRepairId}</p>
            )}
            <div className="mt-6">
              <Link to="/dashboard/customer/repairs">
                <Button variant="glow">View my repair requests</Button>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <Link
          to={`/dashboard/customer/products/${selectedProduct.serial_number}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150 mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to product
        </Link>

        <nav className="text-sm mb-4">
          <Link to="/dashboard/customer/repairs" className="font-semibold text-neutral-900 hover:text-amber-600 transition-colors duration-150">
            Repairs
          </Link>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-neutral-500">Request a repair</span>
        </nav>

        <div className="mb-7">
          <Badge variant="eyebrow" className="block mb-2">New repair request</Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Request a repair</h1>
          <p className="mt-2 text-neutral-600">
            Tell us what's wrong — we'll route it to a technician for review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Registered product */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-neutral-900 bg-violet-200 font-bold">
                {selectedProduct.product_name?.[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                  Registered product
                </p>
                <h2 className="font-bold text-base sm:text-lg">{selectedProduct.product_name}</h2>
                <p className="text-xs sm:text-sm font-mono text-neutral-500 mt-1">
                  SN · {selectedProduct.serial_number}
                </p>
              </div>
            </div>
          </Card>

          {/* Issue details */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <div className="flex items-start gap-3 mb-6">
              <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-neutral-900 bg-amber-100">
                <WrenchIcon />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900">Issue details</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  The more specific you are, the faster the technician can diagnose it.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <SelectField
                id="issueType"
                label="Issue type"
                value={form.issueType}
                onChange={handleChange("issueType")}
                required
                options={[
                  { value: "", label: "Select the type of issue" },
                  ...ISSUE_TYPES.map((issue) => ({ value: issue, label: issue })),
                ]}
              />

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 mb-2">
                  What's wrong with the device?
                  <span className="text-amber-600 ml-1">*</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange("description")}
                  required
                  minLength={10}
                  rows={5}
                  placeholder="e.g. The laptop shuts down randomly when not plugged in, and the battery percentage jumps from 40% to 5% without warning."
                  className="w-full resize-y bg-white border-2 border-neutral-900 rounded-md px-4 py-3 text-sm placeholder:text-neutral-400 transition-all duration-150 hover:bg-amber-50 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0_0_#111827]"
                />
                <div className="flex justify-between gap-3 mt-1.5">
                  <p className="text-xs text-neutral-500">
                    Include symptoms, when the problem started, and anything you have already tried.
                  </p>
                  <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">
                    {form.description.length} chars
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-medium">{submitError}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Link to={`/dashboard/customer/products/${selectedProduct.serial_number}`} className="w-full sm:w-auto">
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="glow" disabled={!canSubmit || submitting} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Submit repair request"}
            </Button>
          </div>

          {!canSubmit && (
            <p className="text-xs text-neutral-500 text-center sm:text-left">
              Please select an issue type and provide at least 10 characters describing the problem.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}