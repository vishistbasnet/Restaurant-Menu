import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "../components/PageLoader";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import type { AdminRole } from "./components/RoleProtectedRoute";

/*
 * Everything under /admin.
 *
 * This file is lazy-loaded (see src/routes/AppRoutes.tsx), so customers
 * visiting the public menu never download any of it.
 *
 * Pages are lazy-loaded too, so each one is only downloaded when visited.
 */
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminMenu = lazy(() => import("./pages/AdminMenu"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminQRCode = lazy(() => import("./pages/AdminQRCode"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminRestaurants = lazy(() => import("./pages/AdminRestaurants"));

/*
 * WHO CAN OPEN WHAT
 *
 * This table is the single place that decides which role may open which
 * admin page. To change access, edit a line here.
 *
 * Reminder: this controls what the BROWSER shows. Real security is enforced
 * by the database rules (RLS) and the edge functions.
 */
const EVERYONE: AdminRole[] = ["super_admin", "admin", "staff"];
const MANAGERS: AdminRole[] = ["super_admin", "admin"];
const SUPER_ADMIN_ONLY: AdminRole[] = ["super_admin"];

const ROLE_PROTECTED_PAGES = [
  { path: "categories", roles: EVERYONE, Page: AdminCategories },
  { path: "menu", roles: EVERYONE, Page: AdminMenu },
  { path: "settings", roles: MANAGERS, Page: AdminSettings },
  { path: "qr", roles: MANAGERS, Page: AdminQRCode },
  { path: "restaurants", roles: SUPER_ADMIN_ONLY, Page: AdminRestaurants },
  { path: "users", roles: SUPER_ADMIN_ONLY, Page: AdminUsers },
];

function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Login: the only admin page that needs no session */}
        <Route path="login" element={<AdminLogin />} />

        {/* Everything below needs a logged-in, active admin */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* /admin: dashboard, open to every admin role */}
            <Route index element={<AdminDashboard />} />

            {/* Pages limited to certain roles (see table above) */}
            {ROLE_PROTECTED_PAGES.map(({ path, roles, Page }) => (
              <Route
                key={path}
                path={path}
                element={<RoleProtectedRoute allowedRoles={roles} />}
              >
                <Route index element={<Page />} />
              </Route>
            ))}
          </Route>
        </Route>

        {/* Unknown /admin/... address */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AdminRoutes;
