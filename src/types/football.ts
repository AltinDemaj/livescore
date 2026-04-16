export interface Team {
  id: number;
  name: string;
  logo: string;
  code?: string;
  country?: string;
}

export interface League {
  id: number;
  name: string;
  logo: string;
  country?: string;
  countryFlag?: string;
  season?: number;
  round?: string;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export type MatchStatus =
  | "NS"    // Not Started
  | "1H"    // First Half
  | "HT"    // Half Time
  | "2H"    // Second Half
  | "ET"    // Extra Time
  | "PEN"   // Penalties
  | "FT"    // Full Time
  | "AET"   // After Extra Time
  | "PSO"   // Penalty Shootout
  | "BT"    // Break Time
  | "SUSP"  // Suspended
  | "INT"   // Interrupted
  | "CANC"  // Cancelled
  | "ABD"   // Abandoned
  | "AWD"   // Awarded
  | "WO"    // Walkover
  | "LIVE"  // Live (generic)
  | "TBD";  // To Be Defined

export interface Match {
  id: number;
  date: string;
  timestamp: number;
  timezone: string;
  status: MatchStatus;
  elapsed: number | null;
  venue?: string;
  referee?: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  score: MatchScore;
  halftimeScore?: MatchScore;
  fulltimeScore?: MatchScore;
  penaltyScore?: MatchScore;
}

export type MatchEventType = "Goal" | "Card" | "Subst" | "Var";

export interface MatchEvent {
  time: number;
  extraTime?: number;
  team: Team;
  player: string;
  assist?: string;
  type: MatchEventType;
  detail: string;
}

export interface PlayerLineup {
  id: number;
  name: string;
  number: number;
  pos: string;
}

export interface TeamLineup {
  team: Team;
  formation: string;
  startXI: PlayerLineup[];
  substitutes: PlayerLineup[];
  coach: string;
}

export interface MatchStatistic {
  type: string;
  home: string | number | null;
  away: string | number | null;
}

export interface StandingsEntry {
  rank: number;
  team: Team;
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form?: string;
  description?: string;
}

export interface StandingsGroup {
  league: League;
  standings: StandingsEntry[];
}

export interface HeadToHead {
  homeWins: number;
  awayWins: number;
  draws: number;
  matches: Match[];
}

export interface MatchDetails {
  match: Match;
  events: MatchEvent[];
  lineups: TeamLineup[];
  statistics: MatchStatistic[];
  h2h?: HeadToHead;
}

export function isMatchLive(status: MatchStatus): boolean {
  return ["1H", "HT", "2H", "ET", "PEN", "BT", "LIVE"].includes(status);
}

export function isMatchFinished(status: MatchStatus): boolean {
  return ["FT", "AET", "PSO", "AWD", "WO"].includes(status);
}

export function isMatchUpcoming(status: MatchStatus): boolean {
  return ["NS", "TBD"].includes(status);
}

export function getStatusLabel(status: MatchStatus, elapsed: number | null): string {
  switch (status) {
    case "1H": return elapsed ? `${elapsed}'` : "1st Half";
    case "2H": return elapsed ? `${elapsed}'` : "2nd Half";
    case "HT": return "HT";
    case "FT": return "FT";
    case "AET": return "AET";
    case "ET": return elapsed ? `${elapsed}'` : "Extra Time";
    case "PEN": return "PEN";
    case "PSO": return "PSO";
    case "NS": return "NS";
    case "BT": return "BT";
    case "SUSP": return "SUSP";
    case "CANC": return "CANC";
    case "ABD": return "ABD";
    case "TBD": return "TBD";
    default: return status;
  }
}
