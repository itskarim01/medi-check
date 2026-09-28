import Link from 'next/link'
import { redirect } from "next/navigation";
import { CircleUserRound, History, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { getSession, clearSession } from "@/lib/auth";
import { pool } from "@/lib/db";

export default async function Navbar() {

    const session = await getSession();
    if (!session) redirect("/login");

    const userResult = await pool.query("SELECT first_name, last_name FROM users WHERE id = $1", [session.userId]);
    const user = userResult.rows[0];
    if (!user) redirect("/login");

    async function logout() {
        "use server";
        await clearSession();
        redirect("/login");
    }

    return (
        <>
            {/* TopAppBar (Mobile Only) */}
            <header className="md:hidden bg-surface dark:bg-on-surface border-b border-outline-variant dark:border-outline fixed top-0 left-0 w-full z-50 flex justify-between items-center px-md h-16">
                <div className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
                    MedTracker
                </div>
                <div className="flex items-center gap-sm text-primary dark:text-primary-fixed-dim">
                    <button aria-label="Profile" className="p-2 hover:bg-surface-container dark:hover:bg-surface-variant transition-colors rounded-full active:scale-95 transition-transform">
                        <CircleUserRound size={24} />
                    </button>
                    <form action={logout} className="contents">
                        <button type="submit" aria-label="Logout" className="p-2 hover:bg-surface-container dark:hover:bg-surface-variant transition-colors rounded-full active:scale-95 transition-transform">
                            <LogOut size={24} />
                        </button>
                    </form>
                </div>
            </header>

            {/* SideNavBar (Desktop Only) */}
            <nav className="hidden md:flex flex-col h-full py-lg bg-surface-container-low border-outline-variant dark:border-outline fixed left-0 top-0 w-64 z-40 transition-all duration-200">
                <div className="px-lg pb-lg border-outline-variant/30">
                    <div className="font-headline-md text-headline-md text-primary mb-lg">MedTracker</div>
                </div>
                <div className="flex-1 py-lg flex flex-col gap-sm px-md overflow-y-auto">
                    <Link href="/me" className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors">
                        <LayoutDashboard size={24} />
                        <span className="font-label-bold text-label-bold">Dashboard</span>
                    </Link>
                    <Link href="/me/logs" className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors">
                        <History size={24} />
                        <span className="font-label-bold text-label-bold">History</span>
                    </Link>
                    <Link href="/me/settings" className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors">
                        <Settings size={24} />
                        <span className="font-label-bold text-label-bold">Settings</span>
                    </Link>                    
                </div>
                <div className="mt-auto px-md flex flex-col gap-sm border-t border-outline-variant/30 pt-lg">
                    <form action={logout} className="contents">
                        <button type="submit" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors w-full text-left">
                            <LogOut size={24} />
                            <span className="font-label-bold text-label-bold">Logout</span>
                        </button>
                    </form>
                    <div className="flex items-center gap-md mb-md p-2 -ml-2 rounded-lg hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors group">
                        <div>
                            <h2 className="font-label-bold text-label-bold text-on-surface group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</h2>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">Manage your treatment</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
