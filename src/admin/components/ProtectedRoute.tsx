import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function ProtectedRoute() {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function checkAdminAccess() {
            try {
                const { data: sessionData } = await supabase.auth.getSession();

                const session = sessionData.session;

                if (!session) {
                    setIsAuthorized(false);
                    return;
                }

                const { data: adminUser, error } = await supabase
                    .from("admin_users")
                    .select("user_id, restaurant_id")
                    .eq("user_id", session.user.id)
                    .maybeSingle();

                if (error) {
                    console.error("Admin verification failed:", error);
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(Boolean(adminUser));
            } finally {
                setIsChecking(false);
            }
        }

        checkAdminAccess();
    }, []);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
                <p className="text-sm text-gray-400">
                    Checking admin access...
                </p>
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;