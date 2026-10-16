import { NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "4b8f7e2a1c9d0e3f5a6b7c8d9e0f1a2b";
const HOST = "stotramani.app";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { urlList?: string[] };
    const urlList = Array.isArray(body.urlList) && body.urlList.length > 0
      ? body.urlList
      : [`https://${HOST}/`, `https://${HOST}/panchang`];

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "IndexNow submission failed", status: response.status },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      submittedUrls: urlList.length,
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "IndexNow submission encountered an error", error: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "IndexNow service ready",
    host: HOST,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
  });
}
