"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import MedForm from "./MedForm";

export default function MedModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleSuccess() {
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-lg right-lg z-50 flex items-center gap-sm bg-primary-container text-on-primary px-lg py-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:opacity-90 transition-all active:scale-95"
      >
        <Plus size={20} />
        <span className="font-label-bold text-label-bold">Add Medication</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-medication-title"
        >
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-lg md:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 id="add-medication-title" className="font-headline-md text-headline-md text-on-surface">
                Add Medication
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <MedForm onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </>
  );
}