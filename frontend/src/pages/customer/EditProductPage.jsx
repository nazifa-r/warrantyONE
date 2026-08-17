import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import DashboardHeader from "../../components/customer/DashboardHeader";
import { productAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Select({ label, id, options, value, onChange, required, placeholder = "Select an option" }) {
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
          {options && options.length > 0 ? (
            options.map((opt) => (
              <option key={opt.id || opt} value={opt.id || opt}>
                {opt.name || opt}
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

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockedField({ label, value }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 mb-2">
        {label}
        <span className="text-neutral-400">
          <LockIcon />
        </span>
      </label>
      <div className="w-full bg-neutral-100 border-2 border-neutral-300 rounded-md px-4 py-2.5 text-sm text-neutral-500 font-mono cursor-not-allowed select-none">
        {value || "N/A"}
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const { serial } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    product_id: "",
    product_name: "",
    category_id: "",
    brand_id: "",
    model_number: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    is_active: true,
  });

  const initials = user?.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  // Fetch product data and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingData(true);
        
        // Fetch product details
        const productRes = await productAPI.getBySerial(serial);
        console.log("Product response:", productRes.data);
        
        // Fetch brands and categories
        const [brandsRes, categoriesRes] = await Promise.all([
          productAPI.getBrands(),
          productAPI.getCategories()
        ]);
        
        console.log("Brands response:", brandsRes.data);
        console.log("Categories response:", categoriesRes.data);
        
        if (productRes.data.success) {
          const product = productRes.data.data;
          setForm({
            product_id: product.product_id || "",
            product_name: product.product_name || "",
            category_id: product.category_id || "",
            brand_id: product.brand_id || "",
            model_number: product.model_number || "",
            serial_number: product.serial_number || "",
            purchase_date: product.purchase_date ? new Date(product.purchase_date).toISOString().split('T')[0] : "",
            purchase_price: product.purchase_price || "",
            is_active: product.is_active !== undefined ? product.is_active : true,
          });
        } else {
          setError("Product not found");
        }
        
        if (brandsRes.data.success) {
          setBrands(brandsRes.data.data || []);
        } else {
          const brandsData = brandsRes.data || [];
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        }
        
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data || []);
        } else {
          const categoriesData = categoriesRes.data || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
        setLoadingData(false);
      }
    };
    fetchData();
  }, [serial]);

  const handleChange = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    if (!form.brand_id) {
      setError("Please select a brand.");
      setUpdating(false);
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      setUpdating(false);
      return;
    }

    try {
      const response = await productAPI.update(form.product_id, form);
      
      if (response.data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => {
          navigate(`/dashboard/customer/products/${form.serial_number}`);
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to update product. Please try again.");
    } finally {
      setUpdating(false);
    }
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

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
        <DashboardHeader user={user} initials={initials} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-neutral-600 mb-6">
            We couldn't find a registered product with serial{" "}
            <span className="font-mono">{serial}</span> to edit.
          </p>
          <Link to="/dashboard/customer/products">
            <Button variant="primary">Back to my products</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Back button */}
        <Link
          to={`/dashboard/customer/products/${serial}`}
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
          Back to product
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
          <Link
            to={`/dashboard/customer/products/${serial}`}
            className="font-semibold text-neutral-900 hover:text-amber-600 transition-colors duration-150"
          >
            {form.product_name || "Product"}
          </Link>
          <span className="text-neutral-400 mx-2">/</span>
          <span className="text-neutral-500">Edit</span>
        </nav>

        {/* Page header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Edit product details
        </h1>
        <p className="mt-2 text-neutral-600">
          Update your device's information. This won't affect your existing
          warranty coverage.
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
          <Card className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#111827]">
            <h2 className="font-semibold text-neutral-900 mb-1">
              Product details
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Fields locked are tied to your
              original invoice and can't be changed. Contact support if any
              of these are incorrect.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                id="product_name"
                label="Product name"
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
              
              <LockedField label="Model number" value={form.model_number} />

              <LockedField label="Serial number" value={form.serial_number} />
              
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

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
            <Link
              to={`/dashboard/customer/products/${serial}`}
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
              disabled={updating || loadingData}
            >
              {updating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}