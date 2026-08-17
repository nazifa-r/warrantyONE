import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import RoleTabs from "../components/ui/RoleTabs";

const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "retailer", label: "Retailer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your auth endpoint — role, email, and password are
    // already in scope here.
    console.log("Sign in", { role, ...form, keepSignedIn });

    if (role === "customer") {
      navigate("/dashboard/customer");
    }
    // TODO: add redirects for retailer / technician / admin once those
    // dashboards exist, e.g.:
    // else if (role === "retailer") navigate("/dashboard/retailer");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden md:flex flex-col justify-between bg-neutral-950 text-white px-10 lg:px-14 py-10 overflow-hidden">
        {/* faint grid pattern */}
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
          <Badge variant="eyebrow" className="!text-amber-300 block mb-4">
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

        <p className="relative text-xs text-neutral-500">
        </p>
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

          {/* Logo shown only on mobile, since the brand panel is hidden below md */}
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <span className="block text-sm font-semibold text-neutral-900 mb-2">
                I am a
              </span>
              <RoleTabs roles={ROLES} value={role} onChange={setRole} />
            </div>

            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange("email")}
            />

            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              autoComplete="current-password"
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

            <Button type="submit" variant="glow" className="w-full">
              Sign in
            </Button>
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