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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      console.warn("Passwords do not match");
      return;
    }
    if (!agreed) {
      console.warn("Must agree to Terms & Privacy Policy");
      return;
    }
    // Wire this up to your auth endpoint — role and form fields are
    // already in scope here.
    console.log("Register", { role, ...form });
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

          <h2 className="text-3xl font-bold text-neutral-900">
            Create your account
          </h2>
          <p className="mt-2 text-neutral-600">
            Fill in your details to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                autoComplete="given-name"
                required
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
              <Input
                id="lastName"
                label="Last name"
                placeholder="Rahman"
                autoComplete="family-name"
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
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange("email")}
            />

            <Input
              id="phone"
              label="Phone number"
              type="tel"
              placeholder="+880 1XX XXX XXXX"
              autoComplete="tel"
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

            <Button type="submit" variant="glow" className="w-full">
              Create account
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