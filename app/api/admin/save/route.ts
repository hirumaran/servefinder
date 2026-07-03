import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

/**
 * Dev-only convenience: writes the admin editor's working copy straight into
 * data/opportunities.json (auth handled by proxy.ts).
 *
 * Intentionally refuses to run in production — deployed filesystems (e.g.
 * Vercel) are ephemeral, so production edits go through the download-and-
 * redeploy flow described in the README instead.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Saving to disk only works in local development. Use “Download JSON” instead." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const file = body as { $comment?: unknown; opportunities?: unknown };
  if (typeof file?.$comment !== "string" || !Array.isArray(file.opportunities)) {
    return NextResponse.json(
      { error: "Body must be { $comment: string, opportunities: [...] }." },
      { status: 400 }
    );
  }

  const target = path.join(process.cwd(), "data", "opportunities.json");
  await writeFile(target, `${JSON.stringify(file, null, 2)}\n`, "utf8");

  return NextResponse.json({ ok: true, count: file.opportunities.length });
}
