import { NextResponse } from "next/server";
import { deleteLink, updateLink } from "@/lib/fsStore";
import { LinkCategory } from "@/types";
import { isAuthenticated } from "@/lib/auth";

function getIdFromRequest(req: Request): string | null {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1] || null;
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const id = getIdFromRequest(req);
  if (!id) return new NextResponse("Bad Request", { status: 400 });

  const body = await req.json();
  const { category, title, description, url } = body as {
    category?: LinkCategory; title?: string; description?: string; url?: string;
  };
  const updated = await updateLink(id, { category, title, description, url });
  if (!updated) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json({ link: updated });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const id = getIdFromRequest(req);
  if (!id) return new NextResponse("Bad Request", { status: 400 });

  const ok = await deleteLink(id);
  if (!ok) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(null, { status: 204 });
} 