import { NextRequest, NextResponse } from "next/server";
import { markAsCompleted, markAsIncomplete, getProgress } from "@/lib/fsStore";

export async function GET() {
  const progress = await getProgress();
  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { linkId, notes, action } = body as {
    linkId: string;
    notes?: string;
    action: "complete" | "incomplete";
  };

  if (!linkId || !action) {
    return new NextResponse("Missing linkId or action", { status: 400 });
  }

  try {
    if (action === "complete") {
      const entry = await markAsCompleted(linkId, notes);
      return NextResponse.json({ entry }, { status: 201 });
    } else if (action === "incomplete") {
      const success = await markAsIncomplete(linkId);
      if (!success) {
        return new NextResponse("Progress entry not found", { status: 404 });
      }
      return NextResponse.json({ success: true });
    } else {
      return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("Progress API error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 