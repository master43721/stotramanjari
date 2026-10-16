import crypto from "node:crypto";

const COOKIE_NAME = "stotramani_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()!).update(payload).digest("base64url");
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const received = Buffer.from(password);
  const target = Buffer.from(expected);
  return received.length === target.length && crypto.timingSafeEqual(received, target);
}

export function createAdminSession() {
  if (!secret()) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function hasValidAdminSession(value: string | undefined) {
  if (!value || !secret()) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

export const adminCookie = { name: COOKIE_NAME, maxAge: SESSION_SECONDS };
