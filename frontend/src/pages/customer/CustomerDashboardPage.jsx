import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import IconTile from "../../components/ui/IconTile";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeWarranties: 0,
    repairsInProgress: 0,
    expiringSoon: 0,
  });

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get customer_id from user
      const customerId = user?.customer_id;
      
      if (!customerId) {
        console.warn("No customer ID found");
        setLoading(false);
        return;
      }

      // Fetch products
      const productsResponse = await productAPI.getAll(customerId);
      
      if (productsResponse.data.success) {
        const productData = productsResponse.data.data || [];
        setProducts(productData);
        
        // Calculate stats
        let activeWarranties = 0;
        let expiringSoon = 0;
        let repairsInProgress = 0;

        productData.forEach(p => {
          // Count warranties
          if (p.warranties && p.warranties.length > 0) {
            const activeWarranty = p.warranties.find(w => w.status === 'Active');
            if (activeWarranty) {
              activeWarranties++;
              const endDate = new Date(activeWarranty.end_date);
              const today = new Date();
              const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
              if (daysLeft <= 30 && daysLeft > 0) {
                expiringSoon++;
              }
            }
          }
          
          // Count repairs in progress
          if (p.repairs && p.repairs.length > 0) {
            const inProgress = p.repairs.filter(r => r.status === 'In_Progress' || r.status === 'Pending');
            repairsInProgress += inProgress.length;
          }
        });

        // Get repairs from all products
        const allRepairs = [];
        productData.forEach(p => {
          if (p.repairs && p.repairs.length > 0) {
            p.repairs.forEach(r => {
              allRepairs.push({
                ...r,
                product_name: p.product_name,
                serial_number: p.serial_number
              });
            });
          }
        });

        setRepairs(allRepairs.slice(0, 5)); // Get latest 5 repairs

        setStats({
          totalProducts: productData.length,
          activeWarranties,
          repairsInProgress,
          expiringSoon,
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Transform products for display (limited to 3)
  const displayProducts = products.slice(0, 3).map(p => {
    const status = getWarrantyStatus(p.warranties || []);
    
    let badge = { label: "Active", variant: "status" };
    if (status === "expiring") {
      badge = { label: "Expiring soon", variant: "warn" };
    } else if (status === "expired") {
      badge = { label: "Expired", variant: "warn" };
    }

    // Get warranty end date
    let expires = "N/A";
    if (p.warranties && p.warranties.length > 0) {
      const activeWarranty = p.warranties.find(w => w.status === 'Active');
      if (activeWarranty) {
        expires = formatDate(activeWarranty.end_date);
      }
    }

    return {
      category: p.category_name || "Uncategorized",
      brand: p.brand_name || "Unknown",
      name: p.product_name,
      serial: p.serial_number,
      expires: expires,
      badge: badge,
      productId: p.product_id,
    };
  });

  // Transform repairs for display
  const displayRepairs = repairs.slice(0, 3).map(r => {
    let statusVariant = "warn";
    if (r.status === 'Completed') statusVariant = "status";
    else if (r.status === 'In_Progress') statusVariant = "warn";
    else if (r.status === 'Pending') statusVariant = "warn";
    else if (r.status === 'Cancelled') statusVariant = "warn";

    return {
      product: r.product_name || "Unknown Product",
      issue: r.issue_type || r.issue_description?.substring(0, 50) || "No description",
      requested: formatDate(r.request_date),
      status: r.status?.replace(/_/g, ' ') || "Unknown",
      statusVariant: statusVariant,
      action: r.status === 'Completed' ? "View" : "Track",
      repairId: r.repair_id,
    };
  });

  // Stats for display
  const STATS = [
    { label: "Registered products", value: stats.totalProducts, tone: "plain" },
    { label: "Active warranties", value: stats.activeWarranties, tone: "coral" },
    { label: "Repair in progress", value: stats.repairsInProgress, tone: "plain" },
    { label: "Expiring within 30 days", value: stats.expiringSoon, tone: "mint" },
  ];

  const STAT_TONE_CLASSES = {
    plain: "bg-white",
    coral: "bg-orange-200",
    mint: "bg-emerald-200",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-700 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Badge variant="eyebrow" className="block mb-2">
                Customer dashboard
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Welcome back, {user?.full_name?.split(' ')[0] || "Customer"}.
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

          {displayProducts.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-neutral-400 py-12 text-center text-neutral-500">
              <p className="font-medium mb-2">No products registered yet</p>
              <p className="text-sm">Start by registering your first product!</p>
              <Link to="/dashboard/customer/products/register" className="inline-block mt-4">
                <Button variant="glow">Register a product</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayProducts.map((product) => (
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
          )}
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

          {displayRepairs.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-neutral-400 py-12 text-center text-neutral-500">
              <p className="font-medium mb-2">No repair requests yet</p>
              <p className="text-sm">Your repair history will appear here.</p>
            </div>
          ) : (
            <>
              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-3">
                {displayRepairs.map((repair) => (
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
                        to={`/dashboard/customer/repairs/${repair.repairId || encodeURIComponent(repair.product)}`}
                        className="text-sm font-semibold underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
                      >
                        {repair.action} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet+: table */}
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
                    {displayRepairs.map((repair, i) => (
                      <tr
                        key={repair.product + repair.requested}
                        className={`transition-colors duration-150 hover:bg-amber-50 ${
                          i !== displayRepairs.length - 1 ? "border-b border-neutral-200" : ""
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
                            to={`/dashboard/customer/repairs/${repair.repairId || encodeURIComponent(repair.product)}`}
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
            </>
          )}
        </section>
      </main>
    </div>
  );
}