import { NextRequest, NextResponse } from "next/server";
import { createLink, listLinks } from "@/lib/fsStore";
import { LinkCategory } from "@/types";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as LinkCategory | null;
  const links = await listLinks(category ?? undefined);
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { category, title, description, url } = body as {
    category: LinkCategory; title: string; description?: string; url: string;
  };
  if (!category || !title || !url) {
    return new NextResponse("Missing fields", { status: 400 });
  }
  const link = await createLink({ category, title, description, url });
  return NextResponse.json({ link }, { status: 201 });
} 