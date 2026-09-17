import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import App from "./App";

import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/layout/AdminLayout";

import "./index.css";

// Admin pages are loaded only when an admin route is visited.
const AdminLogin = lazy(
  () => import("./admin/pages/AdminLogin")
);

const AdminDashboard = lazy(
  () => import("./admin/pages/AdminDashboard")
);

const AdminCategories = lazy(
  () => import("./admin/pages/AdminCategories")
);

const AdminMenu = lazy(
  () => import("./admin/pages/AdminMenu")
);

const AdminSettings = lazy(
  () => import("./admin/pages/AdminSettings")
);

const AdminQRCode = lazy(
  () => import("./admin/pages/AdminQRCode")
);

function AdminPageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-400" />
        <p className="mt-4 text-sm font-medium text-gray-400">
          Loading admin panel...
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<AdminPageLoader />}>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

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
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);
