import type { Metadata } from "next";
import { getLiveMatches } from "@/services/football";
import { LivePageContent } from "./live-content";

export const metadata: Metadata = {
  title: "Live Matches",
  description: "Follow all live football matches in real-time with live scores and updates.",
};

export default async function LivePage() {
  const matches = await getLiveMatches();
  return <LivePageContent initialMatches={matches} />;
}
