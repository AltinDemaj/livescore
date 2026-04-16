import { Suspense } from "react";
import { getFixturesByDate, getLiveMatches, getTopLeagues } from "@/services/football";
import { HomeContent } from "./home-content";
import { MatchListSkeleton } from "@/components/loading-skeleton";

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0];

  const [liveMatches, todayMatches, topLeagues] = await Promise.all([
    getLiveMatches(),
    getFixturesByDate(today),
    getTopLeagues(),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent
        initialLiveMatches={liveMatches}
        initialTodayMatches={todayMatches}
        topLeagues={topLeagues}
      />
    </Suspense>
  );
}

function HomePageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <MatchListSkeleton count={6} />
    </div>
  );
}
