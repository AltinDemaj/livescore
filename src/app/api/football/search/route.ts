import { NextResponse, type NextRequest } from "next/server";
import { searchTeams, searchLeagues } from "@/services/football";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  if (query.length < 2) {
    return NextResponse.json({ teams: [], leagues: [] });
  }

  try {
    const [teams, leagues] = await Promise.all([
      searchTeams(query),
      searchLeagues(query),
    ]);
    return NextResponse.json({ teams, leagues });
  } catch {
    return NextResponse.json({ teams: [], leagues: [] }, { status: 500 });
  }
}
