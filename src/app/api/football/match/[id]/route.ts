import { NextResponse, type NextRequest } from "next/server";
import { getMatchDetails } from "@/services/football";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const details = await getMatchDetails(id);
    if (!details) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json(details);
  } catch {
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}
