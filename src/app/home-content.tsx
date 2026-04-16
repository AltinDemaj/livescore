"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { MatchCard } from "@/components/match-card";
import { MatchList } from "@/components/match-list";
import { LeagueLogo } from "@/components/league-logo";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import { MatchListSkeleton } from "@/components/loading-skeleton";
import { LiveBadge } from "@/components/live-badge";
import { isMatchLive, isMatchFinished, isMatchUpcoming } from "@/types/football";
import type { Match, League } from "@/types/football";
import { cn } from "@/lib/utils";
import Link from "next/link";

type TabValue = "live" | "today" | "upcoming" | "finished";

const TABS: { value: TabValue; label: string; icon: React.ElementType }[] = [
  { value: "live", label: "Live", icon: Zap },
  { value: "today", label: "Today", icon: Calendar },
  { value: "upcoming", label: "Upcoming", icon: Clock },
  { value: "finished", label: "Finished", icon: CheckCircle2 },
];

interface HomeContentProps {
  initialLiveMatches: Match[];
  initialTodayMatches: Match[];
  topLeagues: League[];
}

export function HomeContent({
  initialLiveMatches,
  initialTodayMatches,
  topLeagues,
}: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<TabValue>(
    initialLiveMatches.length > 0 ? "live" : "today",
  );

  const { data: liveMatches } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: async () => {
      const res = await fetch("/api/football/live");
      return res.json() as Promise<Match[]>;
    },
    initialData: initialLiveMatches,
    refetchInterval: 30_000,
  });

  const { data: todayMatches } = useQuery({
    queryKey: ["todayMatches"],
    queryFn: async () => {
      const res = await fetch("/api/football/fixtures");
      return res.json() as Promise<Match[]>;
    },
    initialData: initialTodayMatches,
    refetchInterval: 60_000,
  });

  const filteredMatches = (() => {
    const all = todayMatches || [];
    switch (activeTab) {
      case "live":
        return liveMatches || [];
      case "upcoming":
        return all.filter((m) => isMatchUpcoming(m.status));
      case "finished":
        return all.filter((m) => isMatchFinished(m.status));
      default:
        return all;
    }
  })();

  const liveCount = (liveMatches || []).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero area */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Football Scores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live scores, fixtures, and results from top leagues
        </p>
      </div>

      {/* Search */}
      <SearchBar className="mb-6 max-w-md" />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="mb-6 flex items-center gap-1 rounded-xl bg-card p-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.value === "live" && liveCount > 0 && (
                  <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {liveCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Featured live matches */}
          {activeTab === "live" && liveCount > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <LiveBadge />
                <span className="text-sm font-semibold">Featured Matches</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(liveMatches || []).slice(0, 4).map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {/* Match list */}
          {filteredMatches.length > 0 ? (
            <MatchList
              matches={filteredMatches}
              groupByLeague={activeTab !== "live"}
            />
          ) : (
            <EmptyState
              icon={activeTab === "live" ? Zap : Calendar}
              title={
                activeTab === "live"
                  ? "No live matches right now"
                  : "No matches found"
              }
              description={
                activeTab === "live"
                  ? "Check back later or browse today's fixtures"
                  : "Try a different filter or date"
              }
            />
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Top Leagues */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Top Leagues
            </h2>
            <div className="space-y-1">
              {topLeagues.map((league) => (
                <Link
                  key={league.id}
                  href={`/standings?league=${league.id}`}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                >
                  <LeagueLogo src={league.logo} alt={league.name} size={24} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{league.name}</p>
                    {league.country && (
                      <p className="text-[11px] text-muted-foreground">{league.country}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-red-500/10 p-3 text-center">
                <p className="text-xl font-bold text-red-400">{liveCount}</p>
                <p className="text-[11px] text-muted-foreground">Live Now</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <p className="text-xl font-bold text-primary">
                  {(todayMatches || []).length}
                </p>
                <p className="text-[11px] text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3 text-center">
                <p className="text-xl font-bold text-blue-400">
                  {(todayMatches || []).filter((m) => isMatchUpcoming(m.status)).length}
                </p>
                <p className="text-[11px] text-muted-foreground">Upcoming</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xl font-bold">
                  {(todayMatches || []).filter((m) => isMatchFinished(m.status)).length}
                </p>
                <p className="text-[11px] text-muted-foreground">Finished</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
