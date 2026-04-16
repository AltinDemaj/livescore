import { LeagueLogo } from "./league-logo";
import type { League } from "@/types/football";

interface LeagueHeaderProps {
  league: League;
}

export function LeagueHeader({ league }: LeagueHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <LeagueLogo src={league.logo} alt={league.name} size={32} />
      <div>
        <h2 className="text-lg font-bold">{league.name}</h2>
        {league.country && (
          <p className="text-xs text-muted-foreground">{league.country}</p>
        )}
      </div>
    </div>
  );
}
