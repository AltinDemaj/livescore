"use client";

import { TeamLogo } from "./team-logo";
import { cn } from "@/lib/utils";
import type { StandingsEntry } from "@/types/football";

interface StandingsTableProps {
  entries: StandingsEntry[];
  className?: string;
}

export function StandingsTable({ entries, className }: StandingsTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border/50 text-xs text-muted-foreground">
            <th className="pb-3 pl-3 text-left font-medium w-8">#</th>
            <th className="pb-3 text-left font-medium">Team</th>
            <th className="pb-3 text-center font-medium w-10">MP</th>
            <th className="pb-3 text-center font-medium w-10">W</th>
            <th className="pb-3 text-center font-medium w-10">D</th>
            <th className="pb-3 text-center font-medium w-10">L</th>
            <th className="pb-3 text-center font-medium w-10">GF</th>
            <th className="pb-3 text-center font-medium w-10">GA</th>
            <th className="pb-3 text-center font-medium w-12">GD</th>
            <th className="pb-3 pr-3 text-center font-medium w-12">Pts</th>
            <th className="pb-3 pr-3 text-center font-medium w-20 hidden sm:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className="group border-b border-border/30 transition-colors hover:bg-accent/50"
            >
              <td className="py-2.5 pl-3">
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                  entry.rank <= 4 && "bg-primary/15 text-primary",
                  entry.rank > 4 && entry.rank <= 6 && "bg-blue-500/15 text-blue-400",
                  entry.rank >= entries.length - 2 && "bg-red-500/15 text-red-400",
                )}>
                  {entry.rank}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <TeamLogo src={entry.team.logo} alt={entry.team.name} size={22} />
                  <span className="text-sm font-medium truncate max-w-[150px] sm:max-w-none">
                    {entry.team.name}
                  </span>
                </div>
              </td>
              <td className="py-2.5 text-center text-sm text-muted-foreground">{entry.played}</td>
              <td className="py-2.5 text-center text-sm">{entry.win}</td>
              <td className="py-2.5 text-center text-sm text-muted-foreground">{entry.draw}</td>
              <td className="py-2.5 text-center text-sm text-muted-foreground">{entry.lose}</td>
              <td className="py-2.5 text-center text-sm text-muted-foreground">{entry.goalsFor}</td>
              <td className="py-2.5 text-center text-sm text-muted-foreground">{entry.goalsAgainst}</td>
              <td className={cn(
                "py-2.5 text-center text-sm font-medium",
                entry.goalDiff > 0 && "text-primary",
                entry.goalDiff < 0 && "text-red-400",
              )}>
                {entry.goalDiff > 0 ? `+${entry.goalDiff}` : entry.goalDiff}
              </td>
              <td className="py-2.5 pr-3 text-center text-sm font-bold">{entry.points}</td>
              <td className="py-2.5 pr-3 text-center hidden sm:table-cell">
                {entry.form && (
                  <div className="flex items-center justify-center gap-0.5">
                    {entry.form.split("").map((f, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-4 w-4 rounded-sm text-[9px] font-bold flex items-center justify-center",
                          f === "W" && "bg-primary/20 text-primary",
                          f === "D" && "bg-yellow-500/20 text-yellow-500",
                          f === "L" && "bg-red-500/20 text-red-400",
                        )}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
