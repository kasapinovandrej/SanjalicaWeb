"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";

export default function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="flex w-full max-w-sm items-start gap-3 rounded-lg border border-emerald-200 bg-white p-4 shadow-[0_18px_45px_-20px_rgba(46,14,31,0.45)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={18} />
        </span>
        <p className="flex-1 pt-1 text-sm font-medium text-ink">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori obaveštenje"
          title="Zatvori"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-cream hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
