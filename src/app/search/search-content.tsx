"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Trophy } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { TeamLogo } from "@/components/team-logo";
import { LeagueLogo } from "@/components/league-logo";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Team, League } from "@/types/football";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await fetch(`/api/football/search?q=${encodeURIComponent(query)}`);
      return res.json() as Promise<{ teams: Team[]; leagues: League[] }>;
    },
    enabled: query.length >= 2,
  });

  const handleSearch = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Search</h1>

      <SearchBar
        className="mb-8"
        defaultValue={query}
        onSearch={handleSearch}
        navigateOnSubmit={false}
        placeholder="Search for teams or leagues..."
      />

      {!query && (
        <EmptyState
          icon={Search}
          title="Search for teams or leagues"
          description="Type at least 2 characters to search"
        />
      )}

      {isLoading && query && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-card p-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-8">
          {data.teams.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Teams ({data.teams.length})
                </h2>
              </div>
              <div className="space-y-1">
                {data.teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-colors hover:bg-accent/50"
                  >
                    <TeamLogo src={team.logo} alt={team.name} size={32} />
                    <div>
                      <p className="text-sm font-medium">{team.name}</p>
                      {team.country && (
                        <p className="text-xs text-muted-foreground">{team.country}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.leagues.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Leagues ({data.leagues.length})
                </h2>
              </div>
              <div className="space-y-1">
                {data.leagues.map((league) => (
                  <Link
                    key={league.id}
                    href={`/standings?league=${league.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-colors hover:bg-accent/50"
                  >
                    <LeagueLogo src={league.logo} alt={league.name} size={32} />
                    <div>
                      <p className="text-sm font-medium">{league.name}</p>
                      {league.country && (
                        <p className="text-xs text-muted-foreground">{league.country}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data.teams.length === 0 && data.leagues.length === 0 && (
            <EmptyState
              icon={Search}
              title="No results found"
              description={`No teams or leagues match "${query}"`}
            />
          )}
        </div>
      )}
    </div>
  );
}
