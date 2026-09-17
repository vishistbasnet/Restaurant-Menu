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
import AdminCategories from "./admin/pages/AdminCategories";
import AdminMenu from "./admin/pages/AdminMenu";
import AdminSettings from "./admin/pages/AdminSettings";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/layout/AdminLayout";

import "./index.css";
import AdminQRCode from "./admin/pages/AdminQRCode";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* =========================
            CUSTOMER MENU
        ========================== */}
        <Route path="/" element={<App />} />

        {/* =========================
            ADMIN LOGIN
        ========================== */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        {/* =========================
            PROTECTED ADMIN AREA
        ========================== */}
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

            <Route
              path="/admin/menu"
              element={<AdminMenu />}
            />

            <Route
              path="/admin/settings"
              element={<AdminSettings />}
            />
            <Route
              path="/admin/qr"
              element={<AdminQRCode />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);