import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "../components/PageLoader";

/*
 * Top-level routes.
 *
 * Public menu and admin area are separate lazy chunks, so a customer
 * only downloads the menu and an admin only downloads the admin area.
 * The admin pages and their access rules live in src/admin/AdminRoutes.tsx.
 */
const App = lazy(() => import("../App"));
const AdminRoutes = lazy(() => import("../admin/AdminRoutes"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<App />} />

        {/* Admin area (login, dashboard, menu, users, ...) */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Unknown address: go to the menu */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
