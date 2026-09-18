/* eslint-disable react-refresh/only-export-components */

import {
  StrictMode,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

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
 * Supported administrator roles.
 */
type AdminRole =
  | "super_admin"
  | "admin"
  | "staff";

interface RoleRouteProps {
  allowedRoles: AdminRole[];
}

/*
 * Loading screen displayed while lazy-loaded
 * pages/components are being downloaded.
 */
function AdminPageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-400" />

        <p className="mt-4 text-sm font-medium text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

/*
 * RoleProtectedRoute
 *
 * Authentication is handled by ProtectedRoute.
 *
 * This component performs the additional role check
 * against the admin_users table.
 *
 * Sidebar visibility is NOT treated as security.
 */
function RoleProtectedRoute({
  allowedRoles,
}: RoleRouteProps) {
  const [isChecking, setIsChecking] =
    useState(true);

  const [role, setRole] =
    useState<AdminRole | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkRole() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        /*
         * No authenticated user.
         */
        if (userError || !user) {
          if (userError) {
            console.error(
              "Failed to get authenticated user:",
              userError
            );
          }

          if (isMounted) {
            setRole(null);
          }

          return;
        }

        /*
         * Load the user's admin record.
         */
        const {
          data: adminUser,
          error: roleError,
        } = await supabase
          .from("admin_users")
          .select("role, is_active")
          .eq("user_id", user.id)
          .maybeSingle();

        if (roleError) {
          console.error(
            "Failed to load admin role:",
            roleError
          );

          if (isMounted) {
            setRole(null);
          }

          return;
        }

        /*
         * User does not have an active admin account.
         */
        if (
          !adminUser ||
          !adminUser.is_active
        ) {
          if (isMounted) {
            setRole(null);
          }

          return;
        }

        /*
         * Store the verified role.
         */
        if (isMounted) {
          setRole(
            adminUser.role as AdminRole
          );
        }
      } catch (error) {
        console.error(
          "Role verification failed:",
          error
        );

        if (isMounted) {
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    void checkRole();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * While checking the user's role.
   */
  if (isChecking) {
    return <AdminPageLoader />;
  }

  /*
   * No valid role.
   *
   * Send the user back to admin login.
   */
  if (!role) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  /*
   * User is authenticated but does not
   * have permission for this route.
   */
  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  /*
   * User has the required role.
   */
  return <Outlet />;
}

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