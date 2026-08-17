import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import MyProductsPage from "./pages/customer/MyProductsPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import RegisterProductPage from "./pages/customer/RegisterProductPage";
import EditProductPage from "./pages/customer/EditProductPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* ✅ Wrap all routes with AuthProvider */}
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

          <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
          <Route path="/dashboard/customer/products" element={<MyProductsPage />} />
          <Route path="/dashboard/customer/products/:serial" element={<ProductDetailPage />} />
          <Route path="/dashboard/customer/products/register" element={<RegisterProductPage />} />
          <Route path="/dashboard/customer/products/:serial/edit" element={<EditProductPage />} />

          {/* Catch-all — keep this last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}