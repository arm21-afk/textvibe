import { NextRequest, NextResponse } from "next/server";
import { getTextByCode, saveTextWithCode } from "@/lib/db";

function randomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json(
      { error: "Request body must include a non-empty 'content' string" },
      { status: 400 },
    );
  }

  const content = body.content;

  try {
    // Try a few times to avoid code collisions.
    for (let i = 0; i < 5; i++) {
      const code = randomCode(6);

      // If the code already exists, try another one.
      const existing = await getTextByCode(code);
      if (existing) continue;

      const saved = await saveTextWithCode(code, content);
      if (!saved) {
        continue;
      }

      const url = new URL(`/text/${encodeURIComponent(code)}`, req.nextUrl);

      return NextResponse.json(
        {
          code: saved.code,
          url: url.toString(),
        },
        { status: 201 },
      );
    }
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Database connection failed. Please check environment variables." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: "Failed to generate a unique code. Please try again." },
    { status: 500 },
  );
}
