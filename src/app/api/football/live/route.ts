import { NextResponse } from "next/server";
import { getLiveMatches } from "@/services/football";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getLiveMatches();
    return NextResponse.json(matches);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
