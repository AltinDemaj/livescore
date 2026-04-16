"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";
import { useMemo } from "react";
import type { Team, League } from "@/types/football";

interface FavoriteTeam {
  id: string;
  team_id: number;
  team_name: string;
  team_logo: string | null;
}

interface FavoriteLeague {
  id: string;
  league_id: number;
  league_name: string;
  league_logo: string | null;
}

export function useFavoriteTeams() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["favoriteTeams", user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data } = await supabase
        .from("favorite_teams")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as FavoriteTeam[];
    },
    enabled: !!user && !!supabase,
  });

  const addFavorite = useMutation({
    mutationFn: async (team: Team) => {
      if (!user || !supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("favorite_teams").insert({
        user_id: user.id,
        team_id: team.id,
        team_name: team.name,
        team_logo: team.logo,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favoriteTeams"] }),
  });

  const removeFavorite = useMutation({
    mutationFn: async (teamId: number) => {
      if (!user || !supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("favorite_teams")
        .delete()
        .eq("user_id", user.id)
        .eq("team_id", teamId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favoriteTeams"] }),
  });

  const isFavorite = (teamId: number) =>
    query.data?.some((f) => f.team_id === teamId) ?? false;

  return { ...query, addFavorite, removeFavorite, isFavorite };
}

export function useFavoriteLeagues() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["favoriteLeagues", user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data } = await supabase
        .from("favorite_leagues")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as FavoriteLeague[];
    },
    enabled: !!user && !!supabase,
  });

  const addFavorite = useMutation({
    mutationFn: async (league: League) => {
      if (!user || !supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("favorite_leagues").insert({
        user_id: user.id,
        league_id: league.id,
        league_name: league.name,
        league_logo: league.logo,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favoriteLeagues"] }),
  });

  const removeFavorite = useMutation({
    mutationFn: async (leagueId: number) => {
      if (!user || !supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("favorite_leagues")
        .delete()
        .eq("user_id", user.id)
        .eq("league_id", leagueId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favoriteLeagues"] }),
  });

  const isFavorite = (leagueId: number) =>
    query.data?.some((f) => f.league_id === leagueId) ?? false;

  return { ...query, addFavorite, removeFavorite, isFavorite };
}
