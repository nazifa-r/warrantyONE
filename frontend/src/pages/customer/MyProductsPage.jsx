import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import IconTile from "../../components/ui/IconTile";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expiring", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
];

const STATUS_META = {
  active: { label: "Active", badgeVariant: "status" },
  expiring: { label: "30 days", badgeVariant: "warn" },
  expired: { label: "Expired", badgeVariant: "warn" },
};

// Helper to determine warranty status
const getWarrantyStatus = (warranties) => {
  if (!warranties || warranties.length === 0) return "expired";
  
  const activeWarranty = warranties.find(w => w.status === 'Active');
  if (activeWarranty) {
    const endDate = new Date(activeWarranty.end_date);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 30) return "active";
    if (daysLeft > 0) return "expiring";
  }
  return "expired";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get customer_id from user or API
      let customerId = null;
      if (user?.customer_id) {
        customerId = user.customer_id;
      }
      
      const response = await productAPI.getAll(customerId);
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Transform API product data to match the UI format
  const transformedProducts = useMemo(() => {
    return products.map(p => {
      // Get warranty status from product warranties
      const status = getWarrantyStatus(p.warranties || []);
      const meta = STATUS_META[status];
      
      // Get warranty end date if exists
      let expiresOn = "N/A";
      if (p.warranties && p.warranties.length > 0) {
        const activeWarranty = p.warranties.find(w => w.status === 'Active');
        if (activeWarranty) {
          expiresOn = formatDate(activeWarranty.end_date);
        }
      }

      return {
        id: p.serial_number,
        category: p.category_name || "Uncategorized",
        brand: p.brand_name || "Unknown",
        name: p.product_name,
        serial: p.serial_number,
        registeredOn: formatDate(p.created_at),
        expiresOn: expiresOn,
        purchasePrice: p.purchase_price?.toString() || "0",
        status: status,
        statusMeta: meta,
        productId: p.product_id,
        customerId: p.customer_id,
      };
    });
  }, [products]);

  const filterCounts = useMemo(() => {
    const counts = { all: transformedProducts.length, active: 0, expiring: 0, expired: 0 };
    transformedProducts.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [transformedProducts]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transformedProducts.filter((p) => {
      const matchesFilter = filter === "all" || p.status === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.serial.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter, transformedProducts]);

  // Handle delete product
  const handleDelete = async (productId, serial) => {
    if (!window.confirm(`Are you sure you want to delete product with serial ${serial}?`)) {
      return;
    }
    
    try {
      await productAPI.delete(productId);
      // Refresh products
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading your products...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-sm text-red-700 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-neutral-400 py-16 text-center text-neutral-500">
            <p className="font-medium mb-1">No products found.</p>
            <p className="text-sm">
              {transformedProducts.length === 0 
                ? "Register your first product to get started!" 
                : "Try a different name, serial number, or filter."}
            </p>
            {transformedProducts.length === 0 && (
              <Link to="/dashboard/customer/products/register" className="inline-block mt-4">
                <Button variant="glow">Register a product</Button>
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredProducts.map((product) => {
                const meta = product.statusMeta || STATUS_META[product.status];
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
                <IconTile tone="dark" className="bg-white! text-neutral-900!">
                  +
                </IconTile>
                <span className="text-sm font-medium">
                  Register another product
                </span>
              </Link>
            </div>

            <p className="text-center text-sm text-neutral-500 mt-8">
              Showing {filteredProducts.length} of {transformedProducts.length} registered
              products
            </p>
          </>
        )}
      </main>
    </div>
  );
}