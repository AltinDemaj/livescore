import type {
  Match, MatchEvent, MatchStatistic, TeamLineup, StandingsEntry,
  StandingsGroup, League, Team, MatchStatus, MatchScore, PlayerLineup,
} from "@/types/football";

const API_KEY = process.env.FOOTBALL_API_KEY || "";
const API_HOST = process.env.FOOTBALL_API_HOST || "v3.football.api-sports.io";
const BASE_URL = `https://${API_HOST}`;

async function apiFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": API_KEY,
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

// ---------- Mappers ----------

function mapTeam(raw: { id: number; name: string; logo: string; [k: string]: unknown }): Team {
  return { id: raw.id, name: raw.name, logo: raw.logo };
}

function mapLeague(raw: {
  id: number; name: string; logo: string; country?: string;
  flag?: string; season?: number; round?: string;
}): League {
  return {
    id: raw.id,
    name: raw.name,
    logo: raw.logo,
    country: raw.country,
    countryFlag: raw.flag,
    season: raw.season,
    round: raw.round,
  };
}

function mapScore(raw: { home: number | null; away: number | null } | null): MatchScore {
  return { home: raw?.home ?? null, away: raw?.away ?? null };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapMatch(raw: any): Match {
  return {
    id: raw.fixture.id,
    date: raw.fixture.date,
    timestamp: raw.fixture.timestamp,
    timezone: raw.fixture.timezone || "UTC",
    status: raw.fixture.status.short as MatchStatus,
    elapsed: raw.fixture.status.elapsed,
    venue: raw.fixture.venue?.name,
    referee: raw.fixture.referee,
    league: mapLeague(raw.league),
    homeTeam: mapTeam(raw.teams.home),
    awayTeam: mapTeam(raw.teams.away),
    score: mapScore(raw.goals),
    halftimeScore: mapScore(raw.score?.halftime),
    fulltimeScore: mapScore(raw.score?.fulltime),
    penaltyScore: mapScore(raw.score?.penalty),
  };
}

function mapEvent(raw: any): MatchEvent {
  return {
    time: raw.time.elapsed,
    extraTime: raw.time.extra,
    team: mapTeam(raw.team),
    player: raw.player?.name || "Unknown",
    assist: raw.assist?.name || undefined,
    type: raw.type as MatchEvent["type"],
    detail: raw.detail,
  };
}

function mapLineupPlayer(raw: any): PlayerLineup {
  return {
    id: raw.player?.id ?? 0,
    name: raw.player?.name ?? "Unknown",
    number: raw.player?.number ?? 0,
    pos: raw.player?.pos ?? "",
  };
}

function mapTeamLineup(raw: any): TeamLineup {
  return {
    team: mapTeam(raw.team),
    formation: raw.formation || "",
    startXI: (raw.startXI || []).map(mapLineupPlayer),
    substitutes: (raw.substitutes || []).map(mapLineupPlayer),
    coach: raw.coach?.name || "",
  };
}

function mapStandingsEntry(raw: any): StandingsEntry {
  return {
    rank: raw.rank,
    team: mapTeam(raw.team),
    points: raw.points,
    played: raw.all.played,
    win: raw.all.win,
    draw: raw.all.draw,
    lose: raw.all.lose,
    goalsFor: raw.all.goals.for,
    goalsAgainst: raw.all.goals.against,
    goalDiff: raw.goalsDiff,
    form: raw.form,
    description: raw.description,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------- Public API ----------

export async function getLiveMatches(): Promise<Match[]> {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures", { live: "all" });
  return data.response.map(mapMatch);
}

export async function getFixturesByDate(date: string): Promise<Match[]> {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures", { date });
  return data.response.map(mapMatch);
}

export async function getMatchById(id: string | number): Promise<Match | null> {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures", { id: String(id) });
  if (!data.response.length) return null;
  return mapMatch(data.response[0]);
}

export async function getMatchEvents(fixtureId: string | number): Promise<MatchEvent[]> {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures/events", {
    fixture: String(fixtureId),
  });
  return data.response.map(mapEvent);
}

export async function getMatchLineups(fixtureId: string | number): Promise<TeamLineup[]> {
  const data = await apiFetch<{ response: unknown[] }>("/fixtures/lineups", {
    fixture: String(fixtureId),
  });
  return data.response.map(mapTeamLineup);
}

export async function getMatchStatistics(fixtureId: string | number): Promise<MatchStatistic[]> {
  const data = await apiFetch<{ response: any[] }>("/fixtures/statistics", {
    fixture: String(fixtureId),
  });
  if (!data.response.length) return [];

  const homeStats = data.response[0]?.statistics || [];
  const awayStats = data.response[1]?.statistics || [];

  return homeStats.map((stat: any, i: number) => ({
    type: stat.type,
    home: stat.value,
    away: awayStats[i]?.value ?? null,
  }));
}

export async function getStandings(leagueId: number, season: number): Promise<StandingsGroup | null> {
  const data = await apiFetch<{ response: any[] }>("/standings", {
    league: String(leagueId),
    season: String(season),
  });

  if (!data.response.length) return null;

  const raw = data.response[0];
  return {
    league: mapLeague(raw.league),
    standings: (raw.league.standings[0] || []).map(mapStandingsEntry),
  };
}

export async function getHeadToHead(team1: number, team2: number, last = 5): Promise<Match[]> {
  const h2h = `${team1}-${team2}`;
  const data = await apiFetch<{ response: unknown[] }>("/fixtures/headtohead", {
    h2h,
    last: String(last),
  });
  return data.response.map(mapMatch);
}

export async function searchTeams(query: string): Promise<Team[]> {
  const data = await apiFetch<{ response: any[] }>("/teams", { search: query });
  return data.response.map((r: any) => mapTeam(r.team));
}

export async function searchLeagues(query: string): Promise<League[]> {
  const data = await apiFetch<{ response: any[] }>("/leagues", { search: query });
  return data.response.map((r: any) => mapLeague(r.league));
}

export async function getTopLeagues(): Promise<League[]> {
  const topIds = [39, 140, 135, 78, 61, 2, 3, 848]; // PL, La Liga, Serie A, Bundesliga, Ligue 1, UCL, UEL, UECL
  const currentSeason = new Date().getFullYear();
  const data = await apiFetch<{ response: any[] }>("/leagues", {
    season: String(currentSeason),
    type: "league",
  });

  const allLeagues = data.response.map((r: any) => mapLeague(r.league));
  const top = topIds
    .map((id) => allLeagues.find((l) => l.id === id))
    .filter(Boolean) as League[];

  return top.length ? top : allLeagues.slice(0, 8);
}
