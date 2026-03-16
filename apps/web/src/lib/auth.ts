import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User, { IUser } from "@/models/User";
import dbConnect from "@/lib/db";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as string,
  } as jwt.SignOptions);
}

export function verifyToken(
  token: string,
): { id: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string, remember: boolean = false) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...(remember ? { maxAge: 7 * 24 * 60 * 60 } : {}),
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function getCurrentUser(): Promise<IUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  await dbConnect();
  const user = await User.findById(decoded.id).select("-password");
  return user;
}

export function generateResetToken(): {
  resetToken: string;
  hashedToken: string;
  expiry: Date;
} {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiry = new Date(
    Date.now() + Number(process.env.RESET_TOKEN_EXPIRE || 3600000),
  );
  return { resetToken, hashedToken, expiry };
}

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
