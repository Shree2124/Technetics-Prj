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

  // Allow public paths and API routes
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

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

  // Redirect authenticated users away from auth pages
  if (publicPaths.includes(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
