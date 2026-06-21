"use client";

import { useEffect, useState } from "react";

const listeners = new Set();

function emitToast(kind, message) {
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  listeners.forEach((listener) => listener({ id, kind, message }));
}

export const toast = {
  success: (message) => emitToast("success", message),
  error: (message) => emitToast("error", message),
  info: (message) => emitToast("info", message),
  warning: (message) => emitToast("warning", message),
};

const styles = {
  success: "border-[#8aa399]",
  error: "border-[#999]",
  info: "border-[#bbb]",
  warning: "border-[#777]",
};

export function ToastProvider() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function addToast(item) {
      setItems((current) => [...current, item]);
      window.setTimeout(() => {
        setItems((current) => current.filter((toastItem) => toastItem.id !== item.id));
      }, 3500);
    }

    listeners.add(addToast);
    return () => listeners.delete(addToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border bg-white px-4 py-3 font-mono text-xs text-[#222] shadow-md ${styles[item.kind]}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
