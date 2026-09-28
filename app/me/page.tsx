import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import MedModal from "../components/MedModal";
import DoseActionButtons from "../components/DoseActionButtons";
import Navbar from "../components/Navbar";
import MedActions from "../components/MedActions"
import {
  Clock,
  CheckCircle2,
  Pill,
  Syringe,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function getTodayDisplay() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = now.getDate();
  return `${weekday}, ${month} ${day}${getOrdinalSuffix(day)}`;
}

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

function getMedicationIcon(form: string | null) {
  if (form && form.toLowerCase().includes("inject")) return Syringe;
  return Pill;
}

interface DoseRow {
  medication_id: string;
  title: string;
  dosage: string;
  form: string | null;
  reminder_time_id: string;
  reminder_time: string;
  log_status: "taken" | "skipped" | null;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userResult = await pool.query("SELECT first_name, last_name FROM users WHERE id = $1", [session.userId]);
  const user = userResult.rows[0];
  if (!user) redirect("/login");

  const doseResult = await pool.query<DoseRow>(
    `SELECT
       m.id AS medication_id, m.title, m.dosage, m.form,
       rt.id AS reminder_time_id, rt.reminder_time,
       rl.status AS log_status
     FROM medications m
     JOIN reminder_times rt ON rt.medication_id = m.id
     LEFT JOIN reminder_logs rl ON rl.reminder_time_id = rt.id AND rl.log_date = CURRENT_DATE
     WHERE m.user_id = $1
       AND m.is_active = TRUE
       AND m.start_date <= CURRENT_DATE
       AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
     ORDER BY rt.reminder_time ASC`,
    [session.userId]
  );

  const currentTimeStr = new Date().toTimeString().slice(0, 8);
  const pending = doseResult.rows.filter((d) => d.log_status === null);
  const [nextDose, ...restPending] = pending;
  const isOverdue = nextDose ? nextDose.reminder_time < currentTimeStr : false;

  return (
    <div className="antialiased min-h-screen flex flex-col md:flex-row bg-background text-on-background">
      <Navbar/>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-margin-mobile md:p-margin-desktop w-full max-w-[1200px] mx-auto">
        {/* Header Section */}
        <header className="mb-xl mt-2.5 flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-xs">
              {getGreeting()}, {user.first_name}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">{getTodayDisplay()}</p>
          </div>
        </header>

        {/* Up Next Section */}
        <section>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
            <Clock size={24} className="text-primary" />
            Up Next
          </h2>

          {nextDose ? (
            <>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden mb-md">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-md">
                      <div className="flex items-center gap-sm">
                        <span className="px-sm py-xs bg-error-container text-on-error-container rounded-md font-label-sm text-label-sm font-bold uppercase tracking-wide">
                          {isOverdue ? "Overdue" : "Due Now"}
                        </span>
                        <span className="font-label-bold text-label-bold text-on-surface-variant">
                          {formatTime(nextDose.reminder_time)}
                        </span>
                      </div>
                      <MedActions medicationId={nextDose.medication_id} medicationTitle={nextDose.title} />
                    </div>
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">{nextDose.title}</h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                      {nextDose.dosage}
                      {nextDose.form ? ` • ${nextDose.form}` : ""}
                    </p>
                    <DoseActionButtons reminderTimeId={nextDose.reminder_time_id} />
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center bg-surface-container p-xl rounded-full w-48 h-48 border border-outline-variant/50">
                    <Pill size={48} className="text-primary mb-sm" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                      {nextDose.form || "Medication"}
                    </span>
                  </div>
                </div>
              </div>

              {restPending.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                  {restPending.map((dose, i) => {
                    const Icon = getMedicationIcon(dose.form);
                    const overdue = dose.reminder_time < currentTimeStr;
                    return (
                      <article
                        key={`${dose.reminder_time_id}-${i}`}
                        className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md hover:border-primary/50 transition-colors flex flex-col relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-fixed-dim" />
                        <div className="flex justify-between items-start mb-md pl-sm">
                          <div className={`px-sm py-xs rounded font-label-sm text-label-sm ${overdue ? "bg-error-container text-on-error-container" : "bg-surface-container-high text-on-surface"}`}>
                            {formatTime(dose.reminder_time)}
                          </div>
                          <Icon size={24} className="text-on-surface-variant" />
                        </div>
                        <div className="pl-sm flex-1">
                          <h3 className="font-body-lg text-body-lg text-on-surface font-semibold mb-xs">{dose.title}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            {dose.dosage}
                            {dose.form ? ` • ${dose.form}` : ""}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center gap-sm">
              <CheckCircle2 size={40} className="text-secondary" />
              <p className="font-body-lg text-body-lg text-on-surface">You're all caught up for today.</p>
              <p className="font-body-md text-body-md text-on-surface-variant">No more doses scheduled.</p>
            </div>
          )}
        </section>
      </main>

      <MedModal />
    </div>
  );
}