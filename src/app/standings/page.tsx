import type { Metadata } from "next";
import { Suspense } from "react";
import { StandingsContent } from "./standings-content";

export const metadata: Metadata = {
  title: "Standings",
  description: "Football league standings and tables. View points, results, and rankings for top leagues.",
};

export default function StandingsPage() {
  return (
    <Suspense>
      <StandingsContent />
    </Suspense>
  );
}
