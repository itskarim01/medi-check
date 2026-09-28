"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Ban, Trash2 } from "lucide-react";
import DeleteModal from "./DeleteModal";

export default function MedicationActionsMenu({
  medicationId,
  medicationTitle,
}: {
  medicationId: string;
  medicationTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleDelete() {
    if (!confirm(`Permanently delete ${medicationTitle}? This removes all its history too.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/medications/${medicationId}`, { method: "DELETE" });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Medication options"
        className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-xs w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-20 overflow-hidden">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full flex items-center gap-sm px-md py-sm text-left font-body-md text-body-md text-error hover:bg-error-container transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete Medication
          </button>
        </div>
      )}
    </div>
  );
}