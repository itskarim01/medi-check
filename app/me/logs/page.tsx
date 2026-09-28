import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import { pool } from "@/lib/db";
import Navbar from "@/app/components/Navbar";
import {
  History,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function formatTime(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

function formatLogDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

interface LogRow {
  id: string;
  log_date: string;
  status: "taken" | "skipped";
  reminder_time: string;
  title: string;
  dosage: string;
  form: string | null;
}

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userResult = await pool.query("SELECT first_name FROM users WHERE id = $1", [session.userId]);
  const user = userResult.rows[0];
  if (!user) redirect("/login");

  const logResult = await pool.query<LogRow>(
    `SELECT rl.id, rl.log_date, rl.status, rt.reminder_time, m.title, m.dosage, m.form
     FROM reminder_logs rl
     JOIN reminder_times rt ON rt.id = rl.reminder_time_id
     JOIN medications m ON m.id = rt.medication_id
     WHERE m.user_id = $1 AND rl.log_date >= CURRENT_DATE - INTERVAL '30 days'
     ORDER BY rl.log_date DESC, rt.reminder_time DESC`,
    [session.userId]
  );

  const logs = logResult.rows;
  const takenCount = logs.filter((l) => l.status === "taken").length;
  const adherenceRate = logs.length > 0 ? Math.round((takenCount / logs.length) * 100) : null;

  const groups: { date: string; entries: LogRow[] }[] = [];
  for (const log of logs) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === log.log_date) {
      lastGroup.entries.push(log);
    } else {
      groups.push({ date: log.log_date, entries: [log] });
    }
  }

  return (
    <div className="antialiased min-h-screen pt-2.5 flex flex-col md:flex-row bg-background text-on-background">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-margin-mobile md:p-margin-desktop w-full max-w-[900px] mx-auto">
        <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-xs">
              Medication History
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Last 30 days</p>
          </div>
          {adherenceRate !== null && (
            <div className="bg-surface-container rounded-full px-lg py-sm flex items-center gap-md border border-outline-variant/50 self-start md:self-auto">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Adherence Rate</span>
                <span className="font-label-bold text-label-bold text-primary">{adherenceRate}% taken</span>
              </div>
            </div>
          )}
        </header>

        {groups.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center gap-sm">
            <History size={40} className="text-on-surface-variant" />
            <p className="font-body-lg text-body-lg text-on-surface">No history yet.</p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Marked doses will show up here once you start logging them.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-xl">
            {groups.map((group) => (
              <section key={group.date}>
                <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wide mb-md">
                  {formatLogDate(group.date)}
                </h2>
                <div className="flex flex-col gap-sm">
                  {group.entries.map((entry) => {
                    const isTaken = entry.status === "taken";
                    return (
                      <div key={entry.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex items-center gap-md">
                        {isTaken ? (
                          <CheckCircle2 size={24} className="text-secondary shrink-0" fill="currentColor" />
                        ) : (
                          <XCircle size={24} className="text-error shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-body-lg text-body-lg text-on-surface font-semibold">{entry.title}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant">
                            {entry.dosage}
                            {entry.form ? ` • ${entry.form}` : ""} • Scheduled {formatTime(entry.reminder_time)}
                          </p>
                        </div>
                        <span className={`px-sm py-xs rounded-md font-label-sm text-label-sm font-bold uppercase tracking-wide ${isTaken ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"}`}>
                          {entry.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}