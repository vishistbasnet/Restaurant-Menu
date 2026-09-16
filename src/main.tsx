import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import App from "./App";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/layout/AdminLayout";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminMenu from "./admin/pages/AdminMenu";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Customer Menu */}
        <Route path="/" element={<App />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />
          </Route>
          <Route
            path="/admin/menu"
            element={<AdminMenu />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);