import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// User Pages - Real
import HomePage from '@/pages/user/HomePage';
import ProductsPage from '@/pages/user/ProductsPage';
import ProductDetailPage from '@/pages/user/ProductDetailPage';
import CartPage from '@/pages/user/CartPage';
import CheckoutPage from '@/pages/user/CheckoutPage';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

import ProtectedRoute from './ProtectedRoute';

const UserLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header />
    <Navbar />
    <main className="flex-1"><Outlet /></main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Route>

      <Route path="*" element={<div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-6xl font-bold">404</h1><p>Page not found</p><a href="/" className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm">Go Home</a></div>} />
    </Routes>
  );
};
export default AppRoutes;
