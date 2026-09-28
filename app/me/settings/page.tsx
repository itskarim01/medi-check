import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import Navbar from "@/app/components/Navbar";
import NotifyPush from "@/app/components/NotifyPush";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="antialiased min-h-screen flex flex-col md:flex-row bg-background text-on-background">
      <Navbar/>
      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-2.5 pt-16 md:pt-0 p-margin-mobile md:p-margin-desktop w-full max-w-[900px] mx-auto">
        <header className="mb-xl">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-xs">
            Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage how MedTracker reaches you.</p>
        </header>

        <section>
          <div>
            <NotifyPush/>
          </div>
        </section>
      </main>
    </div>
  );
}