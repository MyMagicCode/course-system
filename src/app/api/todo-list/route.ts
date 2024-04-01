import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: ["哈哈", "喜喜"] });
}
