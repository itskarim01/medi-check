"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pill, Clock, Plus, Trash2 } from "lucide-react";

const FORM_OPTIONS = ["Tablet", "Capsule", "Liquid", "Injection", "Softgel", "Other"];

interface AddMedicationFormProps {
  onSuccess?: () => void;
}

export default function MedForm({ onSuccess }: AddMedicationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    dosage: "",
    form: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });
  const [reminderTimes, setReminderTimes] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTimeChange(index: number, value: string) {
    const updated = [...reminderTimes];
    updated[index] = value;
    setReminderTimes(updated);
  }

  function addTimeField() {
    setReminderTimes([...reminderTimes, ""]);
  }

  function removeTimeField(index: number) {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const validTimes = reminderTimes.filter((t) => t.trim() !== "");
    if (validTimes.length === 0) {
      setError("Add at least one reminder time");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          dosage: form.dosage,
          form: form.form || null,
          start_date: form.start_date,
          end_date: form.end_date || null,
          reminder_times: validTimes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/me");
        router.refresh();
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      <div className="flex flex-col gap-base">
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="title">
          Medication Name
        </label>
        <input
          className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:border-2 transition-all duration-200"
          id="title"
          name="title"
          placeholder="e.g. Lisinopril"
          required
          type="text"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-base">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="dosage">
            Dosage
          </label>
          <input
            className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:border-2 transition-all duration-200"
            id="dosage"
            name="dosage"
            placeholder="e.g. 20mg"
            required
            type="text"
            value={form.dosage}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-base">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="form">
            Form
          </label>
          <select
            className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:border-primary focus:border-2 transition-all duration-200"
            id="form"
            name="form"
            value={form.form}
            onChange={handleChange}
          >
            <option value="">Select form (optional)</option>
            {FORM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-base">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="start_date">
            Start Date
          </label>
          <input
            className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:border-primary focus:border-2 transition-all duration-200"
            id="start_date"
            name="start_date"
            required
            type="date"
            value={form.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-base">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="end_date">
            End Date
          </label>
          <input
            className="w-full h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:border-primary focus:border-2 transition-all duration-200"
            id="end_date"
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
          />
          <p className="font-label-sm text-label-sm text-on-surface-variant">Leave blank for ongoing medications.</p>
        </div>
      </div>

      <div className="flex flex-col gap-base">
        <label className="font-label-bold text-label-bold text-on-surface flex items-center gap-sm">
          <Clock size={18} />
          Reminder Times
        </label>
        <div className="flex flex-col gap-sm">
          {reminderTimes.map((time, index) => (
            <div key={index} className="flex items-center gap-sm">
              <input
                className="flex-1 h-12 px-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:border-primary focus:border-2 transition-all duration-200"
                type="time"
                required
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
              />
              {reminderTimes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeField(index)}
                  aria-label="Remove time"
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTimeField}
          className="flex items-center gap-sm text-primary font-label-bold text-label-bold self-start hover:underline"
        >
          <Plus size={18} />
          Add another time
        </button>
      </div>

      {error && <p className="font-body-md text-body-md text-error">{error}</p>}

      <div className="pt-sm">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-full flex items-center justify-center gap-sm transition-colors duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          <Pill size={20} />
          <span className="font-label-bold text-label-bold">{loading ? "Saving..." : "Add Medication"}</span>
        </button>
      </div>
    </form>
  );
}