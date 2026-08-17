import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Select({ label, id, options, value, onChange, required, placeholder = "Select an option" }) {
  const safeOptions = Array.isArray(options) ? options : [];
  
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-neutral-900 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value || ""}
          onChange={onChange}
          required={required}
          className="w-full appearance-none bg-white border-2 border-neutral-900 rounded-md px-4 py-2.5 pr-10 text-sm text-neutral-900 transition-shadow duration-150 focus:outline-none focus:shadow-[3px_3px_0_0_#111827] cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {safeOptions.length > 0 ? (
            safeOptions.map((opt) => (
              <option 
                key={opt.id || opt.brand_id || opt.category_id || Math.random()} 
                value={opt.id || opt.brand_id || opt.category_id || opt}
              >
                {opt.name || opt.brand_name || opt.category_name || opt}
              </option>
            ))
          ) : (
            <option value="" disabled>No options available</option>
          )}
        </select>
        <svg
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#111827"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const PLANS = [
  {
    value: "standard",
    name: "Standard",
    priceLabel: "Included · 12 mo",
    description: "Manufacturer defect coverage from the purchase date.",
  },
  {
    value: "extended",
    name: "Extended",
    priceLabel: "৳1,200 · 24 mo",
    description: "Adds accidental damage and priority repair slots.",
  },
  {
    value: "premium",
    name: "Premium",
    priceLabel: "৳2,400 · 36 mo",
    description: "Full coverage plus one free screen or battery swap.",
  },
];

export default function RegisterProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  const [form, setForm] = useState({
    product_name: "",
    category_id: "",
    brand_id: "",
    model_number: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    customer_id: "",
  });
  const [plan, setPlan] = useState("standard");

  // Fetch brands and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch brands
        const brandsRes = await productAPI.getBrands();
        console.log("Brands response:", brandsRes);
        console.log("Brands data:", brandsRes.data);
        
        let brandsData = [];
        if (brandsRes.data && brandsRes.data.success) {
          brandsData = brandsRes.data.data || [];
        } else if (brandsRes.data && Array.isArray(brandsRes.data)) {
          brandsData = brandsRes.data;
        } else if (brandsRes.data && brandsRes.data.brands) {
          brandsData = brandsRes.data.brands;
        } else if (Array.isArray(brandsRes)) {
          brandsData = brandsRes;
        } else {
          brandsData = [];
        }
        
        console.log("Processed brands:", brandsData);
        setBrands(brandsData);
        
        // Fetch categories
        const categoriesRes = await productAPI.getCategories();
        console.log("Categories response:", categoriesRes);
        console.log("Categories data:", categoriesRes.data);
        
        let categoriesData = [];
        if (categoriesRes.data && categoriesRes.data.success) {
          categoriesData = categoriesRes.data.data || [];
        } else if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          categoriesData = categoriesRes.data;
        } else if (categoriesRes.data && categoriesRes.data.categories) {
          categoriesData = categoriesRes.data.categories;
        } else if (Array.isArray(categoriesRes)) {
          categoriesData = categoriesRes;
        } else {
          categoriesData = [];
        }
        
        console.log("Processed categories:", categoriesData);
        setCategories(categoriesData);
        
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Failed to load brands and categories. Please refresh the page.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Set customer_id from user
  useEffect(() => {
    if (user?.customer_id) {
      setForm(prev => ({ ...prev, customer_id: user.customer_id }));
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!form.customer_id) {
      setError("Customer information is missing. Please try again.");
      setLoading(false);
      return;
    }

    if (!form.brand_id) {
      setError("Please select a brand.");
      setLoading(false);
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }

    try {
      const response = await productAPI.create(form);
      
      if (response.data.success) {
        setSuccess("Product registered successfully!");
        setTimeout(() => {
          navigate("/dashboard/customer/products");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to register product");
      }
    } catch (err) {
      console.error("Error registering product:", err);
      setError(err.response?.data?.message || "Failed to register product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
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
          <span className="text-neutral-500">Register a product</span>
        </nav>

        {/* Page header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Register a product
        </h1>
        <p className="mt-2 text-neutral-600">
          Add your device's details to activate a digital warranty — no
          paper card needed.
        </p>

        {/* Error/Success messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Product details */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Product details
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              This information is matched against your invoice and brand
              records.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="product_name"
                label="Product name"
                placeholder="e.g. Aurea A14 Laptop"
                required
                value={form.product_name}
                onChange={handleChange("product_name")}
              />
              
              <Select
                id="category_id"
                label="Category"
                options={categories}
                value={form.category_id}
                onChange={handleChange("category_id")}
                required
                placeholder={loadingData ? "Loading categories..." : "Select a category"}
              />

              <Select
                id="brand_id"
                label="Brand"
                options={brands}
                value={form.brand_id}
                onChange={handleChange("brand_id")}
                required
                placeholder={loadingData ? "Loading brands..." : "Select a brand"}
              />
              
              <Input
                id="model_number"
                label="Model number"
                placeholder="e.g. A14-2026"
                required
                value={form.model_number}
                onChange={handleChange("model_number")}
              />

              <Input
                id="serial_number"
                label="Serial number"
                placeholder="e.g. 8842-AX10-7731"
                required
                value={form.serial_number}
                onChange={handleChange("serial_number")}
              />
              
              <Input
                id="purchase_date"
                label="Purchase date"
                type="date"
                required
                value={form.purchase_date}
                onChange={handleChange("purchase_date")}
              />

              <Input
                id="purchase_price"
                label="Purchase price (in BDT)"
                type="number"
                placeholder="e.g. 85000"
                required
                value={form.purchase_price}
                onChange={handleChange("purchase_price")}
              />
            </div>
          </Card>

          {/* Warranty plan */}
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Choose a warranty plan
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Standard coverage is included free with every registration.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {PLANS.map((p) => {
                const active = plan === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPlan(p.value)}
                    aria-pressed={active}
                    className={`text-left rounded-lg border-2 border-neutral-900 p-4 transition-all duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 ${
                      active
                        ? "bg-emerald-200 shadow-[5px_5px_0_0_#111827]"
                        : "bg-white shadow-[3px_3px_0_0_#111827] hover:shadow-[6px_6px_0_0_#111827] hover:bg-amber-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-neutral-900 mb-3 ${
                        active ? "bg-neutral-900" : "bg-white"
                      }`}
                    >
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>

                    <h3 className="font-bold text-neutral-900 mb-1">
                      {p.name}
                    </h3>
                    <p className="text-xs font-mono text-neutral-600 mb-3">
                      {p.priceLabel}
                    </p>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Link
              to="/dashboard/customer/products"
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="glow"
              className="w-full sm:w-auto"
              disabled={loading || loadingData}
            >
              {loading ? "Registering..." : "Register product"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}