import { NextResponse } from "next/server";
import { adminCookie, createAdminSession, verifyAdminPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, createAdminSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: adminCookie.maxAge });
  return response;
}
