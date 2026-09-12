import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import RoleTabs from "../components/ui/RoleTabs";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "retailer", label: "Retailer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Validate terms agreement
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy");
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Map role to match backend
    const roleMap = {
      customer: "Customer",
      retailer: "Retailer",
      technician: "Technician",
      admin: "Admin",
    };

    // Prepare data for backend
    const userData = {
      full_name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: roleMap[role] || "Customer",
    };

    const result = await register(userData);

    if (result.success) {
      // Redirect based on role
      const userRole = result.user?.role?.toLowerCase() || role;
      if (userRole === "customer") {
        navigate("/dashboard/customer");
      } else if (userRole === "retailer") {
        navigate("/dashboard/retailer");
      } else if (userRole === "technician") {
        navigate("/dashboard/technician");
      } else if (userRole === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/customer");
      }
    } else {
      // Display the error message from the backend
      setError(result.error || "Registration failed. Please try again.");
      // Clear password fields on error
      setForm(prev => ({ 
        ...prev, 
        password: "", 
        confirmPassword: "" 
      }));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden md:flex flex-col justify-between bg-neutral-950 text-white px-10 lg:px-14 py-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <Link to="/" className="relative flex items-center gap-2 font-semibold w-fit">
          <span className="w-8 h-8 rounded-md border-2 border-neutral-900 bg-amber-300 text-neutral-900 text-xs font-mono flex items-center justify-center">
            W1
          </span>
          WarrantyOne
        </Link>

        <div className="relative max-w-md">
          <Badge variant="eyebrow" className="text-amber-300! block mb-4">
            Create your account
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            Join WarrantyOne in under a minute.
          </h1>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Whether you're registering a device, running a service center, or
            managing warranty claims for a retailer — one account gets you
            in.
          </p>
        </div>

        <p className="relative text-xs text-neutral-500"></p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-[#F6F4EC] px-6 py-16">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-150 mb-8"
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
          </button>

          <Link
            to="/"
            className="md:hidden flex items-center gap-2 font-semibold text-neutral-900 mb-10 w-fit"
          >
            <span className="w-7 h-7 rounded-md border-2 border-neutral-900 bg-neutral-900 text-white text-xs font-mono flex items-center justify-center">
              W1
            </span>
            WarrantyOne
          </Link>

          <h2 className="text-3xl font-bold text-neutral-900">
            Create your account
          </h2>
          <p className="mt-2 text-neutral-600">
            Fill in your details to get started.
          </p>

          {/* Error message display */}
          {(error || authError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" autoComplete="off">
            <div>
              <span className="block text-sm font-semibold text-neutral-900 mb-2">
                I am a
              </span>
              <RoleTabs roles={ROLES} value={role} onChange={setRole} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First name"
                placeholder="Ayan"
                autoComplete="off"
                required
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
              <Input
                id="lastName"
                label="Last name"
                placeholder="Rahman"
                autoComplete="off"
                required
                value={form.lastName}
                onChange={handleChange("lastName")}
              />
            </div>

            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              required
              value={form.email}
              onChange={handleChange("email")}
            />

            <Input
              id="phone"
              label="Phone number"
              type="tel"
              placeholder="+880 1XX XXX XXXX"
              autoComplete="off"
              required
              value={form.phone}
              onChange={handleChange("phone")}
            />

            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange("password")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs font-mono uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-150"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />

            <Input
              id="confirmPassword"
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="text-xs font-mono uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-150"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              }
            />

            <label className="flex items-start gap-2 text-sm text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded-sm border-2 border-neutral-900 accent-neutral-900"
              />
              I agree to the{" "}
              <Link
                to="/terms"
                className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
              >
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link
                to="/privacy"
                className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
              >
                Privacy Policy
              </Link>
            </label>

            <Button type="submit" variant="glow" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}