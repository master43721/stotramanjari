import { NextResponse } from "next/server";
import { adminCookie } from "@/lib/adminAuth";
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
