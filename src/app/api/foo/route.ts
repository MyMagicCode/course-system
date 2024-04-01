// app/items/route.js
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  console.log("email", email);
  return NextResponse.json({ name, email });
}
