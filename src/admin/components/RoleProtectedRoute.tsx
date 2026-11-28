import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "../../lib/supabase";
import AdminPageLoader from "./AdminPageLoader";

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

export default RoleProtectedRoute;
