/* eslint-disable react-refresh/only-export-components */

import {
  StrictMode,
  lazy,
  Suspense,
} from "react";

import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminPageLoader from "./admin/components/AdminPageLoader";

import "./index.css";

/*
 * Public application
 */
const App = lazy(() => import("./App"));

/*
 * Admin pages
 *
 * Pages are lazy-loaded so they are only downloaded
 * when the corresponding route is visited.
 */
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

const AdminUsers = lazy(
  () => import("./admin/pages/AdminUsers")
);

const AdminRestaurants = lazy(
  () => import("./admin/pages/AdminRestaurants")
);

/*
 * Admin layout and authentication
 */
const ProtectedRoute = lazy(
  () => import("./admin/components/ProtectedRoute")
);

const AdminLayout = lazy(
  () => import("./admin/components/layout/AdminLayout")
);

/*
 * Role check (loads Supabase) is lazy so the public
 * menu never downloads the admin/auth code.
 */
const RoleProtectedRoute = lazy(
  () => import("./admin/components/RoleProtectedRoute")
);

/*
 * Application routes.
 */
function AppRoutes() {
  return (
    <Suspense
      fallback={<AdminPageLoader />}
    >
      <Routes>

        {/* =====================================================
            PUBLIC WEBSITE
           ===================================================== */}

        <Route
          path="/"
          element={<App />}
        />


        {/* =====================================================
            ADMIN LOGIN
           ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =====================================================
            AUTHENTICATED ADMIN AREA
           ===================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>

            {/* =================================================
                DASHBOARD
               ================================================= */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />


            {/* =================================================
                CATEGORIES

                Accessible by:
                - Super Admin
                - Admin
                - Staff
               ================================================= */}

            <Route
              path="/admin/categories"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                    "admin",
                    "staff",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminCategories />}
              />
            </Route>


            {/* =================================================
                MENU

                Accessible by:
                - Super Admin
                - Admin
                - Staff
               ================================================= */}

            <Route
              path="/admin/menu"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                    "admin",
                    "staff",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminMenu />}
              />
            </Route>


            {/* =================================================
                RESTAURANT SETTINGS

                Accessible by:
                - Super Admin
                - Admin
               ================================================= */}

            <Route
              path="/admin/settings"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                    "admin",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminSettings />}
              />
            </Route>


            {/* =================================================
                QR CODE

                Accessible by:
                - Super Admin
                - Admin
               ================================================= */}

            <Route
              path="/admin/qr"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                    "admin",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminQRCode />}
              />
            </Route>


            {/* =================================================
                RESTAURANTS

                Super Admin only.

                IMPORTANT:
                This route is a sibling of /admin/users.
                It must NOT be nested inside /admin/users.
               ================================================= */}

            <Route
              path="/admin/restaurants"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminRestaurants />}
              />
            </Route>


            {/* =================================================
                USER MANAGEMENT

                Super Admin only.
               ================================================= */}

            <Route
              path="/admin/users"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "super_admin",
                  ]}
                />
              }
            >
              <Route
                index
                element={<AdminUsers />}
              />
            </Route>

          </Route>
        </Route>


        {/* =====================================================
            UNKNOWN ROUTES
           ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </Suspense>
  );
}


/*
 * React application entry point.
 */
createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);