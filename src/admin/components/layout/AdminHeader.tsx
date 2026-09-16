import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

interface AdminHeaderProps {
    onMenuClick: () => void;
}

function AdminHeader({
    onMenuClick,
}: AdminHeaderProps) {
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser();

            if (data.user?.email) {
                setEmail(data.user.email);
            }
        }

        loadUser();
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-gray-950/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:bg-white/5 hover:text-white lg:hidden"
                >
                    ☰
                </button>

                <div>
                    <p className="text-sm font-bold text-white">
                        Dashboard
                    </p>

                    <p className="hidden text-xs text-gray-500 sm:block">
                        Manage your restaurant from one place
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-xs text-gray-500">
                        Signed in as
                    </p>

                    <p className="max-w-48 truncate text-sm font-semibold text-gray-300">
                        {email || "Admin"}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-sm font-bold text-yellow-400">
                    {email
                        ? email.charAt(0).toUpperCase()
                        : "A"}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;