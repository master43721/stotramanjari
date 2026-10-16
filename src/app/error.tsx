"use client";
import { useEffect } from "react";
import Link from "next/link";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="container" style={{ minHeight: "65vh", paddingBlock: "8rem", textAlign: "center" }}><h1>Something went wrong</h1><p style={{ marginBlock: "1rem 2rem" }}>Please try again, or return to the sacred library.</p><button className="btn btn-primary" onClick={reset}>Try again</button>{" "}<Link className="btn" href="/">Return home</Link></main>;
}
