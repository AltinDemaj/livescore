"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchList } from "@/components/match-list";
import { EmptyState } from "@/components/empty-state";
import { MatchListSkeleton } from "@/components/loading-skeleton";
import type { Match } from "@/types/football";
import { cn } from "@/lib/utils";

export function FixturesContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: matches, isLoading } = useQuery({
    queryKey: ["fixtures", dateStr],
    queryFn: async () => {
      const res = await fetch(`/api/football/fixtures?date=${dateStr}`);
      return res.json() as Promise<Match[]>;
    },
  });

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 3));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Fixtures</h1>

      {/* Date switcher */}
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex flex-1 gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = format(date, "yyyy-MM-dd") === dateStr;
            const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex shrink-0 flex-col items-center rounded-lg px-3 py-2 text-xs transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span className="text-[10px] font-medium uppercase">
                  {isToday ? "Today" : format(date, "EEE")}
                </span>
                <span className="text-sm font-bold">{format(date, "d")}</span>
                <span className="text-[10px]">{format(date, "MMM")}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
        {matches && (
          <span className="ml-auto">{matches.length} matches</span>
        )}
      </div>

      {isLoading ? (
        <MatchListSkeleton count={8} />
      ) : matches && matches.length > 0 ? (
        <MatchList matches={matches} groupByLeague />
      ) : (
        <EmptyState
          icon={Calendar}
          title="No fixtures"
          description="No matches scheduled for this date."
        />
      )}
    </div>
  );
}
