import { NextResponse } from "next/server";
import { getTopLeagues } from "@/services/football";

export async function GET() {
  try {
    const leagues = await getTopLeagues();
    return NextResponse.json(leagues);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
