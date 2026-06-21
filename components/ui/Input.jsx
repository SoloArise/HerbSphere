"use client";

import { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = forwardRef(function Input(
  { label, error, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[9px] uppercase tracking-widest text-[#666]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full border bg-white px-3 py-2 font-mono text-xs text-[#222] outline-none transition-colors placeholder:text-[#bbb]",
          error ? "border-[#888]" : "border-[#bbb] focus:border-[#333]",
          className
        )}
        {...props}
      />
      {error && <span className="font-mono text-[9px] text-[#666]">{error}</span>}
    </div>
  );
});

export default Input;
