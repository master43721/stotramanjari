import { NextResponse } from "next/server";
import { getPanchangSnapshot, isPanchangCity, isPanchangDate, todayInIndia } from "@/lib/panchangService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("city_id") || "hyderabad";
  const date = searchParams.get("date") || todayInIndia();
  if (!isPanchangCity(cityId) || !isPanchangDate(date)) {
    return NextResponse.json({ message: "Invalid Panchang location or date." }, { status: 400 });
  }
  const data = await getPanchangSnapshot(cityId, date);
  if (!data) return NextResponse.json({ message: "Panchang data is temporarily unavailable." }, { status: 503 });
  return NextResponse.json({ data }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
