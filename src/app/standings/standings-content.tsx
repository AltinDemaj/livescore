"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Trophy } from "lucide-react";
import { LeagueHeader } from "@/components/league-header";
import { StandingsTable } from "@/components/standings-table";
import { EmptyState } from "@/components/empty-state";
import { StandingsTableSkeleton } from "@/components/loading-skeleton";
import type { StandingsGroup, League } from "@/types/football";
import { cn } from "@/lib/utils";

const LEAGUES = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 61, name: "Ligue 1", country: "France" },
];

export function StandingsContent() {
  const searchParams = useSearchParams();
  const defaultLeague = Number(searchParams.get("league")) || 39;
  const [selectedLeague, setSelectedLeague] = useState(defaultLeague);
  const [season] = useState(new Date().getFullYear());

  const { data: standings, isLoading } = useQuery({
    queryKey: ["standings", selectedLeague, season],
    queryFn: async () => {
      const res = await fetch(
        `/api/football/standings?league=${selectedLeague}&season=${season}`,
      );
      return res.json() as Promise<StandingsGroup | null>;
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Standings</h1>

      {/* League selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              selectedLeague === league.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {league.name}
          </button>
        ))}
      </div>

      {standings?.league && (
        <div className="mb-6">
          <LeagueHeader league={standings.league} />
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <StandingsTableSkeleton />
        </div>
      ) : standings?.standings && standings.standings.length > 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <StandingsTable entries={standings.standings} />
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No standings available"
          description="Standings data is not available for this league and season."
        />
      )}
    </div>
  );
}
