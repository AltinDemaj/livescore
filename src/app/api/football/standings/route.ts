import { NextResponse, type NextRequest } from "next/server";
import { getStandings } from "@/services/football";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const leagueId = Number(request.nextUrl.searchParams.get("league") || "39");
  const season = Number(
    request.nextUrl.searchParams.get("season") || new Date().getFullYear(),
  );

  try {
    const standings = await getStandings(leagueId, season);
    return NextResponse.json(standings);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
