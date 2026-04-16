import { NextResponse, type NextRequest } from "next/server";
import { getFixturesByDate } from "@/services/football";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ||
    new Date().toISOString().split("T")[0];

  try {
    const matches = await getFixturesByDate(date);
    return NextResponse.json(matches);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
