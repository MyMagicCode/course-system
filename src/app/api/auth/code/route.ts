import { NextResponse } from "next/server";
import { addCodeCache } from "./cache";

export async function GET() {
  const uniqueId = generateUniqueId();
  const res = await fetch(
    "http://127.0.0.1:3008/getCodeImage?name=" + uniqueId
  );
  const data = await res.json();
  addCodeCache(uniqueId, data.value);
  return NextResponse.json({
    url: data.url,
    uuid: uniqueId,
  });
}

/** 生成一串32位的uuid */
function generateUniqueId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";
  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueId += characters[randomIndex];
  }
  return uniqueId;
}
