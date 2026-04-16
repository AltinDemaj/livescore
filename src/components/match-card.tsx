"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TeamLogo } from "./team-logo";
import { ScoreBadge } from "./score-badge";
import { isMatchLive, isMatchUpcoming } from "@/types/football";
import type { Match } from "@/types/football";
import { format } from "date-fns";

interface MatchCardProps {
  match: Match;
  className?: string;
  showLeague?: boolean;
}

export function MatchCard({ match, className, showLeague = true }: MatchCardProps) {
  const live = isMatchLive(match.status);
  const upcoming = isMatchUpcoming(match.status);

  return (
    <Link
      href={`/match/${match.id}`}
      className={cn(
        "group block rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:bg-accent/50",
        live && "border-red-500/20 bg-red-500/[0.03]",
        className,
      )}
    >
      {showLeague && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{match.league.name}</span>
          </div>
          <ScoreBadge status={match.status} elapsed={match.elapsed} />
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} size={28} />
            <span className="truncate text-sm font-medium">{match.homeTeam.name}</span>
          </div>
          <span className={cn(
            "ml-4 text-lg font-bold tabular-nums",
            live && "text-foreground",
          )}>
            {match.score.home ?? (upcoming ? "" : "-")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} size={28} />
            <span className="truncate text-sm font-medium">{match.awayTeam.name}</span>
          </div>
          <span className={cn(
            "ml-4 text-lg font-bold tabular-nums",
            live && "text-foreground",
          )}>
            {match.score.away ?? (upcoming ? "" : "-")}
          </span>
        </div>
      </div>

      {upcoming && (
        <div className="mt-3 text-center text-xs text-muted-foreground">
          {format(new Date(match.date), "HH:mm")}
        </div>
      )}
    </Link>
  );
}
