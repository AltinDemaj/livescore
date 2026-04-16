import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-live" />
      Live
    </span>
  );
}
