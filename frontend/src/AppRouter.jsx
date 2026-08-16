import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * Central route map. Add a new <Route> here for every page you build,
 * and drop the real page file into src/pages/.
 *
 * To turn a placeholder into a real page:
 *  1. Create src/pages/PricingPage.jsx (or whatever it is)
 *  2. Import it above
 *  3. Swap the <PlaceholderPage .../> below for <PricingPage />
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/product"
          element={
            <PlaceholderPage
              title="Product"
              description="A closer look at how WarrantyOne works is coming here."
            />
          }
        />
        <Route
          path="/retailers"
          element={
            <PlaceholderPage
              title="For Retailers"
              description="Retailer-specific tools and onboarding details are coming here."
            />
          }
        />
        <Route
          path="/service-centers"
          element={
            <PlaceholderPage
              title="For Service Centers"
              description="Service center workflows and technician tools are coming here."
            />
          }
        />
        <Route
          path="/pricing"
          element={
            <PlaceholderPage
              title="Pricing"
              description="Plan details and pricing tiers are coming here."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <PlaceholderPage
              title="Contact"
              description="A contact form will live here."
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/forgot-password"
          element={
            <PlaceholderPage
              title="Forgot password"
              description="The password reset flow is coming here."
            />
          }
        />

        {/* Catch-all — keep this last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}