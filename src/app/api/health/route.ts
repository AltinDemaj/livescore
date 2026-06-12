import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "rain-for-sleeping",
    message: "Dev server is reachable from your device.",
    mobilePreview: "/mobile",
    demoVideo: "/mobile-demo.mp4",
    timestamp: new Date().toISOString(),
  });
}
