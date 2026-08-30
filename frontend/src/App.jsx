import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F4EC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // Get dashboard title based on role
  const getDashboardTitle = () => {
    switch (user?.role?.toLowerCase()) {
      case 'customer':
        return 'Customer Dashboard';
      case 'retailer':
        return 'Retailer Dashboard';
      case 'technician':
        return 'Technician Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EC]">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-md border-2 border-neutral-900 bg-amber-300 text-neutral-900 text-xs font-mono flex items-center justify-center">
              W1
            </span>
            <h1 className="text-xl font-bold text-neutral-900">WarrantyOne</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-neutral-600">Welcome, {user?.full_name}</span>
            <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors duration-150 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">{getDashboardTitle()}</h2>
          <p className="text-neutral-600 mb-6">You are successfully logged in to WarrantyOne.</p>
          
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="font-semibold text-neutral-900 mb-3">User Information:</h3>
            <div className="bg-neutral-50 rounded-lg p-4">
              <pre className="text-sm text-neutral-700 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-900">Products</h4>
              <p className="text-sm text-blue-700">Manage your registered products</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-900">Warranties</h4>
              <p className="text-sm text-green-700">View your warranty status</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-900">Repairs</h4>
              <p className="text-sm text-purple-700">Track repair requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Role-specific dashboard components
const CustomerDashboard = () => <Dashboard />;
const RetailerDashboard = () => <Dashboard />;
const TechnicianDashboard = () => <Dashboard />;
const AdminDashboard = () => <Dashboard />;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/customer" 
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/retailer" 
              element={
                <ProtectedRoute>
                  <RetailerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/technician" 
              element={
                <ProtectedRoute>
                  <TechnicianDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;