import { NextResponse } from "next/server";
export async function GET(request: Request) {
  const key = process.env.DEVDARSHA_API_KEY;
  if (!key) return NextResponse.json({ message: "Panchang service is not configured." }, { status: 503 });
  const cityId = new URL(request.url).searchParams.get("city_id") || "hyderabad";
  if (!/^[a-z-]{2,64}$/.test(cityId)) return NextResponse.json({ message: "Invalid city." }, { status: 400 });
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const upstream = await fetch("https://panchang.devdarsha.com/v1/panchang/daily", { method: "POST", headers: { "X-Api-Key": key, "Content-Type": "application/json" }, body: JSON.stringify({ date, city_id: cityId, faith_filter: "hindu", timezone: "Asia/Kolkata" }), next: { revalidate: 900 } });
  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) return NextResponse.json({ message: "Panchang data is temporarily unavailable." }, { status: 502 });
  return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
