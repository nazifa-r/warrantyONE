import React, { useState, useEffect, useRef } from "react";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Refs to clear autofill
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Clear browser autofill on mount
  useEffect(() => {
    // Clear any autofilled values
    if (emailRef.current) {
      emailRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
    setForm({ email: "", password: "" });
  }, []);

  const handleChange = (field) => (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent any autofill from interfering
    const currentEmail = emailRef.current?.value || form.email;
    const currentPassword = passwordRef.current?.value || form.password;
    
    if (!currentEmail || !currentPassword) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login({
      email: currentEmail,
      password: currentPassword,
    });

    if (result.success) {
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
      setError(result.error || "Login failed. Please check your credentials.");
      // Clear password field and ref
      setForm(prev => ({ ...prev, password: "" }));
      if (passwordRef.current) {
        passwordRef.current.value = "";
      }
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
            Sign in to your account
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            One login. Every device, warranty, and repair you own.
          </h1>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Users, retailers, technicians, and admins all sign in here — your
            dashboard adjusts to your role automatically.
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

          <h2 className="text-3xl font-bold text-neutral-900">Welcome back</h2>
          <p className="mt-2 text-neutral-600">
            Enter your credentials to access your account.
          </p>

          {/* Error message display - stays visible until user types */}
          {(error || authError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md animate-shake">
              <p className="text-sm text-red-600 font-medium">{error || authError}</p>
            </div>
          )}

          <form 
            onSubmit={handleSubmit} 
            className="mt-8 space-y-6" 
            autoComplete="off"
            noValidate
          >
            <div>
              <span className="block text-sm font-semibold text-neutral-900 mb-2">
                I am a
              </span>
              <RoleTabs roles={ROLES} value={role} onChange={setRole} />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900">
                Email address
              </label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors duration-150"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-2 border-neutral-900 accent-neutral-900"
                />
                Keep me signed in
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-2 px-4 rounded-md hover:bg-neutral-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
            >
              Register →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}