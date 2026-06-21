"use client";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variants = {
  primary: "bg-[#333] text-white border-[#333] hover:bg-[#111]",
  secondary: "bg-white text-[#333] border-[#999] hover:bg-[#f5f5f5]",
  ghost: "bg-transparent text-[#555] border-transparent hover:text-[#111]",
};

const sizes = {
  sm: "text-[10px] px-3 py-1",
  md: "text-xs px-4 py-2",
  lg: "text-sm px-6 py-3",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-mono tracking-wide border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
}
