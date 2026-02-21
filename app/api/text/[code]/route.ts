import { NextRequest, NextResponse } from "next/server";
import { getTextByCode } from "@/lib/db";

type RouteParams = {
  params: Promise<{ code: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { code: rawCode } = await params;
  const code = rawCode.trim();

  if (!code) {
    return NextResponse.json(
      { error: "Code is required" },
      { status: 400 },
    );
  }

  const existing = await getTextByCode(code);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      code: existing.code,
      content: existing.content ?? "",
      createdAt: existing.updated_at,
    },
    { status: 200 },
  );
}

