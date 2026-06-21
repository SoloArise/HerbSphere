"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className="fixed left-1/2 top-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#bbb] bg-white p-6 shadow-lg outline-none"
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2
              id="modal-title"
              className="font-mono text-sm font-bold tracking-wide text-[#222]"
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            className="ml-auto cursor-pointer text-[#888] hover:text-[#333]"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="font-mono text-xs leading-relaxed text-[#444]">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
