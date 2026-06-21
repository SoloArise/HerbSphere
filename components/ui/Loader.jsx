function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const barHeight = {
  sm: "h-3",
  md: "h-5",
  lg: "h-8",
};

const gaps = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1.5",
};

export default function Loader({ size = "md", label, fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("flex items-end", gaps[size])}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn("w-1.5 animate-pulse bg-[#999]", barHeight[size])}
            style={{ animationDelay: `${i * 0.1}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
      {label && (
        <span className="font-mono text-[9px] tracking-widest text-[#999]">
          {label}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        {content}
      </div>
    );
  }

  return content;
}
