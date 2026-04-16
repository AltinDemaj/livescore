import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/types/football";
import { isMatchLive, isMatchFinished, getStatusLabel } from "@/types/football";

interface ScoreBadgeProps {
  status: MatchStatus;
  elapsed: number | null;
  className?: string;
}

export function ScoreBadge({ status, elapsed, className }: ScoreBadgeProps) {
  const label = getStatusLabel(status, elapsed);
  const live = isMatchLive(status);
  const finished = isMatchFinished(status);

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider",
        live && "bg-red-500/15 text-red-400 border-red-500/20",
        finished && "bg-muted text-muted-foreground",
        !live && !finished && "bg-primary/10 text-primary",
        className,
      )}
    >
      {live && (
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-live inline-block" />
      )}
      {label}
    </Badge>
  );
}
