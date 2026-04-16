import type { Metadata } from "next";
import { getMatchDetails } from "@/services/football";
import { MatchDetailContent } from "./match-detail-content";
import { notFound } from "next/navigation";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const details = await getMatchDetails(id);
  if (!details) return { title: "Match Not Found" };
  const { match } = details;
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    description: `${match.homeTeam.name} vs ${match.awayTeam.name} — ${match.league.name}. Live score, events, lineups, and statistics.`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const details = await getMatchDetails(id);

  if (!details) notFound();

  return <MatchDetailContent details={details} />;
}
