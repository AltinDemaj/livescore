import type {
  Match, MatchEvent, MatchStatistic, TeamLineup, StandingsEntry,
  StandingsGroup, League, Team, PlayerLineup,
} from "@/types/football";

const LEAGUES: League[] = [
  { id: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", country: "England", countryFlag: "https://media.api-sports.io/flags/gb.svg", season: 2024 },
  { id: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png", country: "Spain", countryFlag: "https://media.api-sports.io/flags/es.svg", season: 2024 },
  { id: 135, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png", country: "Italy", countryFlag: "https://media.api-sports.io/flags/it.svg", season: 2024 },
  { id: 78, name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png", country: "Germany", countryFlag: "https://media.api-sports.io/flags/de.svg", season: 2024 },
  { id: 61, name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png", country: "France", countryFlag: "https://media.api-sports.io/flags/fr.svg", season: 2024 },
  { id: 2, name: "UEFA Champions League", logo: "https://media.api-sports.io/football/leagues/2.png", country: "World", season: 2024 },
];

const TEAMS: Record<number, Team> = {
  33: { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" },
  34: { id: 34, name: "Newcastle", logo: "https://media.api-sports.io/football/teams/34.png" },
  40: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
  42: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
  49: { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" },
  50: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" },
  47: { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" },
  66: { id: 66, name: "Aston Villa", logo: "https://media.api-sports.io/football/teams/66.png" },
  529: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
  541: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
  157: { id: 157, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" },
  165: { id: 165, name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" },
  489: { id: 489, name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png" },
  496: { id: 496, name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png" },
  505: { id: 505, name: "Inter Milan", logo: "https://media.api-sports.io/football/teams/505.png" },
  85: { id: 85, name: "Paris Saint-Germain", logo: "https://media.api-sports.io/football/teams/85.png" },
  35: { id: 35, name: "Bournemouth", logo: "https://media.api-sports.io/football/teams/35.png" },
  51: { id: 51, name: "Brighton", logo: "https://media.api-sports.io/football/teams/51.png" },
  39: { id: 39, name: "Wolves", logo: "https://media.api-sports.io/football/teams/39.png" },
  46: { id: 46, name: "Leicester City", logo: "https://media.api-sports.io/football/teams/46.png" },
};

function team(id: number): Team {
  return TEAMS[id] || { id, name: `Team ${id}`, logo: "" };
}

const now = new Date();
const todayStr = now.toISOString().split("T")[0];

function makeMatch(
  id: number, home: number, away: number, leagueIdx: number,
  status: Match["status"], elapsed: number | null,
  homeGoals: number | null, awayGoals: number | null,
  minuteOffset = 0,
): Match {
  const d = new Date(now.getTime() + minuteOffset * 60000);
  return {
    id,
    date: d.toISOString(),
    timestamp: Math.floor(d.getTime() / 1000),
    timezone: "UTC",
    status,
    elapsed,
    venue: "Stadium",
    league: LEAGUES[leagueIdx % LEAGUES.length],
    homeTeam: team(home),
    awayTeam: team(away),
    score: { home: homeGoals, away: awayGoals },
    halftimeScore: { home: homeGoals !== null ? Math.min(homeGoals, 1) : null, away: awayGoals !== null ? Math.min(awayGoals, 1) : null },
    fulltimeScore: status === "FT" ? { home: homeGoals, away: awayGoals } : { home: null, away: null },
  };
}

export const MOCK_LIVE_MATCHES: Match[] = [
  makeMatch(1001, 42, 50, 0, "1H", 34, 1, 0),
  makeMatch(1002, 40, 49, 0, "2H", 67, 2, 1),
  makeMatch(1003, 529, 541, 1, "HT", 45, 1, 1),
  makeMatch(1004, 157, 165, 3, "1H", 22, 0, 0),
];

export const MOCK_TODAY_MATCHES: Match[] = [
  ...MOCK_LIVE_MATCHES,
  makeMatch(1005, 33, 47, 0, "FT", 90, 3, 2),
  makeMatch(1006, 489, 496, 2, "FT", 90, 0, 1),
  makeMatch(1007, 505, 85, 5, "NS", null, null, null, 180),
  makeMatch(1008, 34, 66, 0, "NS", null, null, null, 240),
  makeMatch(1009, 35, 51, 0, "NS", null, null, null, 300),
  makeMatch(1010, 39, 46, 0, "NS", null, null, null, 360),
];

export const MOCK_EVENTS: MatchEvent[] = [
  { time: 12, team: team(42), player: "B. Saka", type: "Goal", detail: "Normal Goal" },
  { time: 23, team: team(50), player: "E. Haaland", type: "Card", detail: "Yellow Card" },
  { time: 38, team: team(42), player: "M. Ødegaard", type: "Goal", detail: "Normal Goal", assist: "B. Saka" },
  { time: 55, team: team(50), player: "K. De Bruyne", type: "Goal", detail: "Normal Goal" },
  { time: 70, team: team(50), player: "B. Silva", type: "Subst", detail: "Substitution 1" },
  { time: 78, team: team(42), player: "G. Jesus", type: "Card", detail: "Yellow Card" },
];

export const MOCK_STATISTICS: MatchStatistic[] = [
  { type: "Ball Possession", home: "58%", away: "42%" },
  { type: "Total Shots", home: 14, away: 9 },
  { type: "Shots on Goal", home: 6, away: 3 },
  { type: "Shots off Goal", home: 5, away: 4 },
  { type: "Corner Kicks", home: 7, away: 3 },
  { type: "Offsides", home: 2, away: 1 },
  { type: "Fouls", home: 12, away: 15 },
  { type: "Yellow Cards", home: 1, away: 2 },
  { type: "Red Cards", home: 0, away: 0 },
  { type: "Passes Total", home: 523, away: 378 },
  { type: "Passes Accurate", home: 456, away: 312 },
];

function makePlayers(prefix: string): PlayerLineup[] {
  return Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    name: `${prefix} Player ${i + 1}`,
    number: i + 1,
    pos: i === 0 ? "G" : i <= 4 ? "D" : i <= 7 ? "M" : "F",
  }));
}

function makeSubs(prefix: string): PlayerLineup[] {
  return Array.from({ length: 7 }, (_, i) => ({
    id: 12 + i,
    name: `${prefix} Sub ${i + 1}`,
    number: 12 + i,
    pos: "M",
  }));
}

export const MOCK_LINEUPS: TeamLineup[] = [
  { team: team(42), formation: "4-3-3", startXI: makePlayers("ARS"), substitutes: makeSubs("ARS"), coach: "M. Arteta" },
  { team: team(50), formation: "4-3-3", startXI: makePlayers("MCI"), substitutes: makeSubs("MCI"), coach: "P. Guardiola" },
];

function makeStandingsEntry(rank: number, teamId: number, pts: number, w: number, d: number, l: number, gf: number, ga: number): StandingsEntry {
  return {
    rank, team: team(teamId), points: pts, played: w + d + l,
    win: w, draw: d, lose: l, goalsFor: gf, goalsAgainst: ga,
    goalDiff: gf - ga, form: "WWDLW".slice(0, 5),
  };
}

export const MOCK_STANDINGS: StandingsGroup = {
  league: LEAGUES[0],
  standings: [
    makeStandingsEntry(1, 40, 82, 25, 7, 4, 78, 30),
    makeStandingsEntry(2, 42, 79, 24, 7, 5, 72, 28),
    makeStandingsEntry(3, 50, 75, 23, 6, 7, 80, 38),
    makeStandingsEntry(4, 49, 66, 19, 9, 8, 60, 42),
    makeStandingsEntry(5, 33, 63, 18, 9, 9, 55, 40),
    makeStandingsEntry(6, 47, 60, 17, 9, 10, 58, 48),
    makeStandingsEntry(7, 34, 58, 16, 10, 10, 52, 44),
    makeStandingsEntry(8, 66, 55, 15, 10, 11, 48, 42),
    makeStandingsEntry(9, 51, 52, 14, 10, 12, 50, 50),
    makeStandingsEntry(10, 35, 48, 13, 9, 14, 44, 52),
  ],
};

export const MOCK_TOP_LEAGUES = LEAGUES;

export const MOCK_SEARCH_TEAMS = Object.values(TEAMS);
export const MOCK_SEARCH_LEAGUES = LEAGUES;
