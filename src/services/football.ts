import type {
  Match, MatchEvent, MatchStatistic, TeamLineup,
  StandingsGroup, League, Team, MatchDetails,
} from "@/types/football";
import * as api from "./football-api";
import * as mock from "./mock-data";

const USE_MOCK = !process.env.FOOTBALL_API_KEY;

export async function getLiveMatches(): Promise<Match[]> {
  if (USE_MOCK) return mock.MOCK_LIVE_MATCHES;
  try { return await api.getLiveMatches(); }
  catch { return mock.MOCK_LIVE_MATCHES; }
}

export async function getFixturesByDate(date: string): Promise<Match[]> {
  if (USE_MOCK) return mock.MOCK_TODAY_MATCHES;
  try { return await api.getFixturesByDate(date); }
  catch { return mock.MOCK_TODAY_MATCHES; }
}

export async function getMatchById(id: string | number): Promise<Match | null> {
  if (USE_MOCK) {
    return mock.MOCK_TODAY_MATCHES.find((m) => m.id === Number(id)) ?? mock.MOCK_TODAY_MATCHES[0];
  }
  try { return await api.getMatchById(id); }
  catch { return null; }
}

export async function getMatchEvents(id: string | number): Promise<MatchEvent[]> {
  if (USE_MOCK) return mock.MOCK_EVENTS;
  try { return await api.getMatchEvents(id); }
  catch { return []; }
}

export async function getMatchLineups(id: string | number): Promise<TeamLineup[]> {
  if (USE_MOCK) return mock.MOCK_LINEUPS;
  try { return await api.getMatchLineups(id); }
  catch { return []; }
}

export async function getMatchStatistics(id: string | number): Promise<MatchStatistic[]> {
  if (USE_MOCK) return mock.MOCK_STATISTICS;
  try { return await api.getMatchStatistics(id); }
  catch { return []; }
}

export async function getStandings(leagueId: number, season: number): Promise<StandingsGroup | null> {
  if (USE_MOCK) return mock.MOCK_STANDINGS;
  try { return await api.getStandings(leagueId, season); }
  catch { return null; }
}

export async function getMatchDetails(id: string | number): Promise<MatchDetails | null> {
  const match = await getMatchById(id);
  if (!match) return null;

  const [events, lineups, statistics] = await Promise.all([
    getMatchEvents(id),
    getMatchLineups(id),
    getMatchStatistics(id),
  ]);

  return { match, events, lineups, statistics };
}

export async function getTopLeagues(): Promise<League[]> {
  if (USE_MOCK) return mock.MOCK_TOP_LEAGUES;
  try { return await api.getTopLeagues(); }
  catch { return mock.MOCK_TOP_LEAGUES; }
}

export async function searchTeams(query: string): Promise<Team[]> {
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return mock.MOCK_SEARCH_TEAMS.filter((t) => t.name.toLowerCase().includes(q));
  }
  try { return await api.searchTeams(query); }
  catch { return []; }
}

export async function searchLeagues(query: string): Promise<League[]> {
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return mock.MOCK_SEARCH_LEAGUES.filter((l) => l.name.toLowerCase().includes(q));
  }
  try { return await api.searchLeagues(query); }
  catch { return []; }
}
