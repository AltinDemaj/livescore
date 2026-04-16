"use client";

import type { Match } from "@/types/football";
import { MatchCard } from "./match-card";
import { LeagueLogo } from "./league-logo";
import { cn } from "@/lib/utils";

interface MatchListProps {
  matches: Match[];
  groupByLeague?: boolean;
  className?: string;
}

export function MatchList({ matches, groupByLeague = true, className }: MatchListProps) {
  if (!groupByLeague) {
    return (
      <div className={cn("space-y-2", className)}>
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    );
  }

  const grouped = matches.reduce<Record<number, { league: Match["league"]; matches: Match[] }>>(
    (acc, match) => {
      const lid = match.league.id;
      if (!acc[lid]) {
        acc[lid] = { league: match.league, matches: [] };
      }
      acc[lid].matches.push(match);
      return acc;
    },
    {},
  );

  return (
    <div className={cn("space-y-6", className)}>
      {Object.values(grouped).map(({ league, matches: leagueMatches }) => (
        <div key={league.id}>
          <div className="mb-3 flex items-center gap-2 px-1">
            <LeagueLogo src={league.logo} alt={league.name} size={20} />
            <div>
              <h3 className="text-sm font-semibold">{league.name}</h3>
              {league.country && (
                <p className="text-[11px] text-muted-foreground">{league.country}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {leagueMatches.map((m) => (
              <MatchCard key={m.id} match={m} showLeague={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
