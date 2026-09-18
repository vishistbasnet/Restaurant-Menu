import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function SuperAdminRoute() {
    const [isChecking, setIsChecking] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function checkSuperAdmin() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    if (isMounted) {
                        setIsSuperAdmin(false);
                    }
                    return;
                }

                const { data, error } =
                    await supabase.rpc("is_super_admin");

                if (error) {
                    console.error(
                        "Super admin verification failed:",
                        error
                    );

                    if (isMounted) {
                        setIsSuperAdmin(false);
                    }

                    return;
                }

                if (isMounted) {
                    setIsSuperAdmin(Boolean(data));
                }
            } catch (error) {
                console.error(
                    "Failed to verify super admin:",
                    error
                );

                if (isMounted) {
                    setIsSuperAdmin(false);
                }
            } finally {
                if (isMounted) {
                    setIsChecking(false);
                }
            }
        }

        checkSuperAdmin();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isChecking) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center bg-gray-950 text-white">
                <p className="text-sm text-gray-400">
                    Checking permissions...
                </p>
            </div>
        );
    }

    if (!isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
}

export default SuperAdminRoute;