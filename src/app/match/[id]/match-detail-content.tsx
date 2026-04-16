"use client";

import { useState } from "react";
import { TeamLogo } from "@/components/team-logo";
import { LeagueLogo } from "@/components/league-logo";
import { ScoreBadge } from "@/components/score-badge";
import { StandingsTable } from "@/components/standings-table";
import { cn } from "@/lib/utils";
import { isMatchLive, isMatchUpcoming } from "@/types/football";
import type { MatchDetails, MatchEvent, MatchStatistic, TeamLineup } from "@/types/football";
import { MapPin, User, Clock } from "lucide-react";
import { format } from "date-fns";

type TabValue = "overview" | "events" | "lineups" | "stats";

const TABS: { value: TabValue; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "events", label: "Events" },
  { value: "lineups", label: "Lineups" },
  { value: "stats", label: "Stats" },
];

export function MatchDetailContent({ details }: { details: MatchDetails }) {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");
  const { match, events, lineups, statistics } = details;
  const live = isMatchLive(match.status);
  const upcoming = isMatchUpcoming(match.status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Match header */}
      <div className={cn(
        "rounded-2xl border border-border/50 bg-card p-6 mb-6",
        live && "border-red-500/20",
      )}>
        {/* League info */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <LeagueLogo src={match.league.logo} alt={match.league.name} size={20} />
          <span className="text-sm text-muted-foreground">{match.league.name}</span>
          {match.league.round && (
            <span className="text-xs text-muted-foreground">• {match.league.round}</span>
          )}
        </div>

        {/* Score area */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
            <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} size={56} />
            <span className="text-sm font-semibold text-center truncate max-w-full">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {upcoming ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">vs</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(new Date(match.date), "HH:mm")}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-4xl font-bold tabular-nums">
                  <span>{match.score.home ?? "-"}</span>
                  <span className="text-muted-foreground">-</span>
                  <span>{match.score.away ?? "-"}</span>
                </div>
                <ScoreBadge status={match.status} elapsed={match.elapsed} />
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
            <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} size={56} />
            <span className="text-sm font-semibold text-center truncate max-w-full">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
          {match.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.venue}
            </div>
          )}
          {match.referee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {match.referee}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(match.date), "MMM d, yyyy • HH:mm")}
          </div>
        </div>

        {/* HT score */}
        {match.halftimeScore && match.halftimeScore.home !== null && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Half Time: {match.halftimeScore.home} - {match.halftimeScore.away}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-card p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab events={events} statistics={statistics} match={details.match} />
      )}
      {activeTab === "events" && <EventsTab events={events} />}
      {activeTab === "lineups" && <LineupsTab lineups={lineups} />}
      {activeTab === "stats" && <StatsTab statistics={statistics} />}
    </div>
  );
}

function OverviewTab({
  events,
  statistics,
  match,
}: {
  events: MatchEvent[];
  statistics: MatchStatistic[];
  match: MatchDetails["match"];
}) {
  const goals = events.filter((e) => e.type === "Goal");
  const cards = events.filter((e) => e.type === "Card");

  return (
    <div className="space-y-6">
      {goals.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Goals
          </h3>
          <div className="space-y-2">
            {goals.map((event, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-xs font-bold text-muted-foreground shrink-0">
                  {event.time}&apos;
                </span>
                <TeamLogo src={event.team.logo} alt={event.team.name} size={18} />
                <span className="font-medium">{event.player}</span>
                {event.assist && (
                  <span className="text-xs text-muted-foreground">
                    (assist: {event.assist})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cards.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cards
          </h3>
          <div className="space-y-2">
            {cards.map((event, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-xs font-bold text-muted-foreground shrink-0">
                  {event.time}&apos;
                </span>
                <div className={cn(
                  "h-4 w-3 rounded-sm shrink-0",
                  event.detail.includes("Yellow") && "bg-yellow-500",
                  event.detail.includes("Red") && "bg-red-500",
                )} />
                <TeamLogo src={event.team.logo} alt={event.team.name} size={18} />
                <span className="font-medium">{event.player}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {statistics.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Key Stats
          </h3>
          <div className="space-y-3">
            {statistics.slice(0, 5).map((stat) => (
              <StatBar key={stat.type} stat={stat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventsTab({ events }: { events: MatchEvent[] }) {
  if (!events.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
        No events available yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="space-y-0">
        {events.map((event, i) => (
          <div key={i} className="flex items-center gap-3 border-l-2 border-border/50 py-3 pl-4 relative">
            <div className="absolute -left-[5px] h-2 w-2 rounded-full bg-border" />
            <span className="w-10 text-xs font-bold text-muted-foreground shrink-0">
              {event.time}&apos;{event.extraTime ? `+${event.extraTime}` : ""}
            </span>
            <EventIcon type={event.type} detail={event.detail} />
            <TeamLogo src={event.team.logo} alt={event.team.name} size={18} />
            <div className="min-w-0">
              <span className="text-sm font-medium">{event.player}</span>
              {event.assist && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({event.assist})
                </span>
              )}
              <p className="text-[11px] text-muted-foreground">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventIcon({ type, detail }: { type: string; detail: string }) {
  if (type === "Goal") {
    return <span className="text-sm">⚽</span>;
  }
  if (type === "Card") {
    return (
      <div className={cn(
        "h-4 w-3 rounded-sm shrink-0",
        detail.includes("Yellow") && "bg-yellow-500",
        detail.includes("Red") && "bg-red-500",
      )} />
    );
  }
  if (type === "Subst") {
    return <span className="text-sm">🔄</span>;
  }
  return <span className="text-sm">📋</span>;
}

function LineupsTab({ lineups }: { lineups: TeamLineup[] }) {
  if (!lineups.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
        Lineups not available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {lineups.map((lineup) => (
        <div key={lineup.team.id} className="rounded-xl border border-border/50 bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <TeamLogo src={lineup.team.logo} alt={lineup.team.name} size={24} />
            <div>
              <h3 className="text-sm font-semibold">{lineup.team.name}</h3>
              <p className="text-xs text-muted-foreground">
                {lineup.formation} • Coach: {lineup.coach}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Starting XI
            </h4>
            <div className="space-y-1">
              {lineup.startXI.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                    {p.number}
                  </span>
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">
                    {p.pos}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Substitutes
            </h4>
            <div className="space-y-1">
              {lineup.substitutes.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-6 text-center text-xs font-bold">{p.number}</span>
                  <span>{p.name}</span>
                  <span className="ml-auto text-[10px] uppercase">{p.pos}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsTab({ statistics }: { statistics: MatchStatistic[] }) {
  if (!statistics.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
        Statistics not available yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
      {statistics.map((stat) => (
        <StatBar key={stat.type} stat={stat} />
      ))}
    </div>
  );
}

function StatBar({ stat }: { stat: MatchStatistic }) {
  const homeVal = typeof stat.home === "string"
    ? parseFloat(stat.home) || 0
    : stat.home ?? 0;
  const awayVal = typeof stat.away === "string"
    ? parseFloat(stat.away) || 0
    : stat.away ?? 0;
  const total = homeVal + awayVal || 1;
  const homePerc = (homeVal / total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium tabular-nums">{stat.home ?? 0}</span>
        <span className="text-xs text-muted-foreground">{stat.type}</span>
        <span className="font-medium tabular-nums">{stat.away ?? 0}</span>
      </div>
      <div className="flex h-1.5 gap-0.5 rounded-full overflow-hidden">
        <div
          className="rounded-full bg-primary transition-all"
          style={{ width: `${homePerc}%` }}
        />
        <div
          className="rounded-full bg-muted-foreground/30 transition-all"
          style={{ width: `${100 - homePerc}%` }}
        />
      </div>
    </div>
  );
}
