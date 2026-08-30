import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const STATUS_BADGE = {
  active: { label: "Active", variant: "status" },
  expiring: { label: "Expiring soon", variant: "warn" },
  expired: { label: "Expired", variant: "warn" },
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Format price
const formatPrice = (price) => {
  if (!price) return "0";
  return Number(price).toLocaleString();
};

export default function ProductDetailPage() {
  const { serial } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  // Fetch product details on mount
  useEffect(() => {
    fetchProductDetails();
  }, [serial]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await productAPI.getBySerial(serial);
      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this product?`)) {
      return;
    }
    
    try {
      setDeleting(true);
      await productAPI.delete(product.product_id);
      navigate("/dashboard/customer/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
      setDeleting(false);
    }
  };

  // Determine product status
  const getStatus = () => {
    if (!product?.warranties || product.warranties.length === 0) return "expired";
    
    const activeWarranty = product.warranties.find(w => w.status === 'Active');
    if (activeWarranty) {
      const endDate = new Date(activeWarranty.end_date);
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 30) return "active";
      if (daysLeft > 0) return "expiring";
    }
    return "expired";
  };

  // Get warranty details
  const getWarrantyDetails = () => {
    if (!product?.warranties || product.warranties.length === 0) {
      return {
        plan: "No Warranty",
        startDate: "N/A",
        endDate: "N/A",
        status: "Expired"
      };
    }
    
    const activeWarranty = product.warranties.find(w => w.status === 'Active');
    if (activeWarranty) {
      return {
        plan: activeWarranty.plan_name || "Warranty",
        startDate: formatDate(activeWarranty.start_date),
        endDate: formatDate(activeWarranty.end_date),
        status: activeWarranty.status
      };
    }
    
    // Get the most recent warranty
    const latest = product.warranties[0];
    return {
      plan: latest.plan_name || "Warranty",
      startDate: formatDate(latest.start_date),
      endDate: formatDate(latest.end_date),
      status: latest.status
    };
  };

  // Calculate days of coverage left
  const getDaysLeft = () => {
    if (!product?.warranties || product.warranties.length === 0) return 0;
    
    const activeWarranty = product.warranties.find(w => w.status === 'Active');
    if (activeWarranty) {
      const endDate = new Date(activeWarranty.end_date);
      const today = new Date();
      return Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading product details...</p>
        </main>
      </div>
    );
  }

  if (error || !product) {
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
            <Button variant="primary">Back to products</Button>
          </Link>
        </main>
      </div>
    );
  }

  const status = getStatus();
  const statusBadge = STATUS_BADGE[status] || STATUS_BADGE.expired;
  const isExpired = status === "expired";
  const warranty = getWarrantyDetails();
  const daysLeft = getDaysLeft();
  const repairs = product.repairs || [];

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
          <span className="text-neutral-500">{product.product_name}</span>
        </nav>

        {/* Title + actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.product_name}</h1>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/dashboard/customer/products/${product.serial_number}/${isExpired ? "renew" : "extend"}`}
              className="flex-1 sm:flex-none"
            >
              <Button variant="glow" className="w-full sm:w-auto">
                {isExpired ? "Renew warranty" : "Choose a warranty plan"}
              </Button>
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium border-2 border-neutral-900 bg-red-200 text-neutral-900 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-red-400 hover:shadow-[6px_6px_0_0_#111827] active:translate-x-0 active:translate-y-0 active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete"}
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
                  <dd className="font-mono break-all">{product.model_number || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Serial number
                  </dt>
                  <dd className="font-mono break-all">{product.serial_number}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Category
                  </dt>
                  <dd>{product.category_name || "Uncategorized"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Brand
                  </dt>
                  <dd>{product.brand_name || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Purchase date
                  </dt>
                  <dd>{formatDate(product.purchase_date)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Purchase price
                  </dt>
                  <dd className="font-mono">৳{formatPrice(product.purchase_price)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Status
                  </dt>
                  <dd>{product.is_active ? "Active" : "Inactive"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-mono uppercase tracking-wide text-neutral-500 mb-1">
                    Owner
                  </dt>
                  <dd>{product.customer_name || user?.full_name || "N/A"}</dd>
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
                  to={`/dashboard/customer/repairs/new?product=${product.serial_number}`}
                  className="text-sm font-semibold underline underline-offset-2 hover:text-amber-600 transition-colors duration-150 whitespace-nowrap"
                >
                  Request repair →
                </Link>
              </div>

              {repairs.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8">
                  No repair records for this product.
                </p>
              ) : (
                <div className="hidden sm:block rounded-lg border-2 border-neutral-900 overflow-x-auto">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wide">
                        <th className="text-left px-4 py-3 font-medium">Date</th>
                        <th className="text-left px-4 py-3 font-medium">Issue</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {repairs.map((repair, i) => (
                        <tr
                          key={repair.repair_id || i}
                          className={`transition-colors duration-150 hover:bg-amber-50 ${
                            i !== repairs.length - 1 ? "border-b border-neutral-200" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-neutral-700">
                            {formatDate(repair.request_date)}
                          </td>
                          <td className="px-4 py-3">{repair.issue_type}</td>
                          <td className="px-4 py-3">
                            <Badge variant={repair.status === 'Completed' ? 'status' : 'warn'}>
                              {repair.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                {warranty.plan}
              </h3>

              <dl className="space-y-3 border-t border-white/10 pt-4 mb-6 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Start date</dt>
                  <dd className="font-mono">{warranty.startDate}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">End date</dt>
                  <dd className="font-mono">{warranty.endDate}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-400">Status</dt>
                  <dd>{warranty.status}</dd>
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
                  {repairs.length}
                </div>
                <div className="text-xs sm:text-sm text-neutral-700 mt-1">
                  Repairs completed
                </div>
              </div>
              <div className="rounded-lg border-2 border-neutral-900 bg-white px-4 sm:px-5 py-4 shadow-[3px_3px_0_0_#111827] transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#111827] hover:bg-amber-50 cursor-default">
                <div className="text-2xl sm:text-3xl font-bold">
                  {daysLeft}
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
              <p className="text-sm text-neutral-500">
                No upcoming maintenance reminders for this product.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}