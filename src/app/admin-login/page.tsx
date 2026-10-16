"use client";
import { FormEvent, useState } from "react";
export default function AdminLoginPage() {
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setPending(true); setError(""); const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); if (response.ok) window.location.assign("/admin"); else { setError("The password was not accepted."); setPending(false); } }
  return <main className="container" style={{ maxWidth: 480, paddingBlock: "8rem" }}><h1>Admin sign in</h1><form onSubmit={submit} style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />{error && <p role="alert">{error}</p>}<button className="btn btn-primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button></form></main>;
}
