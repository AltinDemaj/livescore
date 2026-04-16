import type { Metadata } from "next";
import { FixturesContent } from "./fixtures-content";

export const metadata: Metadata = {
  title: "Fixtures",
  description: "Browse football fixtures by date. See upcoming matches, results, and schedules.",
};

export default function FixturesPage() {
  return <FixturesContent />;
}
