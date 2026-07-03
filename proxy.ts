import { NextResponse, type NextRequest } from "next/server";

/**
 * Gates /admin (and its save API) behind HTTP Basic Auth.
 *
 * The password comes from the ADMIN_PASSWORD env var (see .env.example).
 * If it isn't set, admin is simply disabled — the public site is unaffected.
 * Students never hit this: only the operator ever visits /admin.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse(
      "Admin is disabled. Set ADMIN_PASSWORD in .env.local (see README) and restart.",
      { status: 503, headers: { "content-type": "text/plain" } }
    );
  }

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice("Basic ".length));
      // Format is "username:password"; any username is accepted.
      const provided = decoded.slice(decoded.indexOf(":") + 1);
      if (provided === password) return NextResponse.next();
    } catch {
      // Malformed base64 → fall through to the 401 below.
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="ServeFinder Admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
