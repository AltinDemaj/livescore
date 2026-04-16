"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useFavoriteTeams, useFavoriteLeagues } from "@/hooks/use-favorites";
import { TeamLogo } from "@/components/team-logo";
import { LeagueLogo } from "@/components/league-logo";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star, LogOut, User, Trophy, Users, Loader2,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: favoriteTeams, isLoading: teamsLoading, removeFavorite: removeTeam } = useFavoriteTeams();
  const { data: favoriteLeagues, isLoading: leaguesLoading, removeFavorite: removeLeague } = useFavoriteLeagues();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-bold">Sign in to view your dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Save your favorite teams and leagues for quick access
          </p>
          <Link href="/auth/sign-in">
            <Button className="mt-6">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1.5">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Favorite Teams */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Favorite Teams
            </h2>
          </div>

          {teamsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : favoriteTeams && favoriteTeams.length > 0 ? (
            <div className="space-y-1">
              {favoriteTeams.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <TeamLogo src={fav.team_logo || ""} alt={fav.team_name} size={28} />
                    <span className="text-sm font-medium">{fav.team_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-yellow-500 hover:text-red-400"
                    onClick={() => removeTeam.mutate(fav.team_id)}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No favorite teams yet. Browse matches to add some!
            </p>
          )}
        </div>

        {/* Favorite Leagues */}
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Favorite Leagues
            </h2>
          </div>

          {leaguesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : favoriteLeagues && favoriteLeagues.length > 0 ? (
            <div className="space-y-1">
              {favoriteLeagues.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent/50"
                >
                  <Link
                    href={`/standings?league=${fav.league_id}`}
                    className="flex items-center gap-3 min-w-0"
                  >
                    <LeagueLogo src={fav.league_logo || ""} alt={fav.league_name} size={28} />
                    <span className="text-sm font-medium truncate">{fav.league_name}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-yellow-500 hover:text-red-400 shrink-0"
                    onClick={() => removeLeague.mutate(fav.league_id)}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No favorite leagues yet. Visit the standings page to add some!
            </p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/live"
          className="rounded-xl border border-border/50 bg-card p-4 text-center transition-colors hover:bg-accent/50"
        >
          <p className="text-2xl mb-1">⚡</p>
          <p className="text-sm font-medium">Live Matches</p>
        </Link>
        <Link
          href="/fixtures"
          className="rounded-xl border border-border/50 bg-card p-4 text-center transition-colors hover:bg-accent/50"
        >
          <p className="text-2xl mb-1">📅</p>
          <p className="text-sm font-medium">Fixtures</p>
        </Link>
        <Link
          href="/standings"
          className="rounded-xl border border-border/50 bg-card p-4 text-center transition-colors hover:bg-accent/50"
        >
          <p className="text-2xl mb-1">🏆</p>
          <p className="text-sm font-medium">Standings</p>
        </Link>
        <Link
          href="/search"
          className="rounded-xl border border-border/50 bg-card p-4 text-center transition-colors hover:bg-accent/50"
        >
          <p className="text-2xl mb-1">🔍</p>
          <p className="text-sm font-medium">Search</p>
        </Link>
      </div>
    </div>
  );
}
