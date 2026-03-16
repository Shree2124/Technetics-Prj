import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production");

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
const rolePaths: Record<string, string[]> = {
  admin: ["/admin", "/dashboard"],
  verifier: ["/verifier", "/dashboard"],
  citizen: ["/citizen", "/dashboard"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files and API routes (except auth paths that need checking)
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const isPublicPath = publicPaths.includes(pathname);

  // If user is trying to access a public path like /login or /
  if (isPublicPath) {
    // If they have a token, verify it. If valid and not on '/', redirect to dashboard
    if (token) {
      const decoded = await verifyJWT(token);
      if (decoded && pathname !== "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    // Allow access to public paths if no token or invalid token, or if it's the home page '/'
    return NextResponse.next();
  }

  // From here on, the path is protected. Check for token.
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("token", "", { maxAge: 0 });
    return response;
  }

  const { role } = decoded;

  // Check role-based access
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/verifier") && role !== "verifier") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/citizen") && role !== "citizen") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
