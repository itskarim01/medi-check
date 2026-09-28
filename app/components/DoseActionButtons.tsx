"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function DoseActionButtons({ reminderTimeId }: { reminderTimeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"taken" | "skipped" | null>(null);

  async function logDose(status: "taken" | "skipped") {
    setLoading(status);
    try {
      const res = await fetch(`/api/reminder-logs/${reminderTimeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-md">
      <button
        onClick={() => logDose("taken")}
        disabled={loading !== null}
        className="flex-1 md:flex-none py-md px-xl bg-secondary text-on-secondary rounded-lg font-label-bold text-label-bold hover:bg-on-secondary-container transition-colors flex items-center justify-center gap-sm active:scale-[0.98] disabled:opacity-50"
      >
        <CheckCircle2 size={20} />
        {loading === "taken" ? "Saving..." : "Mark as Taken"}
      </button>
      <button
        onClick={() => logDose("skipped")}
        disabled={loading !== null}
        className="flex-1 md:flex-none py-md px-xl border-2 border-outline-variant text-on-surface rounded-lg font-label-bold text-label-bold hover:bg-surface-container hover:border-outline transition-colors flex items-center justify-center gap-sm active:scale-[0.98] disabled:opacity-50"
      >
        {loading === "skipped" ? "Saving..." : "Skip Dose"}
      </button>
    </div>
  );
}