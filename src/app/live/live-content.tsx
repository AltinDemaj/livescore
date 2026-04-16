"use client";

import { useQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { MatchList } from "@/components/match-list";
import { EmptyState } from "@/components/empty-state";
import { MatchListSkeleton } from "@/components/loading-skeleton";
import { LiveBadge } from "@/components/live-badge";
import type { Match } from "@/types/football";

interface LivePageContentProps {
  initialMatches: Match[];
}

export function LivePageContent({ initialMatches }: LivePageContentProps) {
  const { data: matches, isLoading } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: async () => {
      const res = await fetch("/api/football/live");
      return res.json() as Promise<Match[]>;
    },
    initialData: initialMatches,
    refetchInterval: 15_000,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Live Matches</h1>
        <LiveBadge />
        {matches.length > 0 && (
          <span className="ml-auto text-sm text-muted-foreground">
            {matches.length} match{matches.length !== 1 && "es"} live
          </span>
        )}
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Auto-refreshing every 15 seconds
      </p>

      {isLoading ? (
        <MatchListSkeleton count={6} />
      ) : matches.length > 0 ? (
        <MatchList matches={matches} groupByLeague />
      ) : (
        <EmptyState
          icon={Zap}
          title="No live matches right now"
          description="There are no football matches being played at the moment. Check back later or browse today's fixtures."
        />
      )}
    </div>
  );
}
