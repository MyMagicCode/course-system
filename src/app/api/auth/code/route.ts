import { NextResponse } from "next/server";
import { addCodeCache } from "./cache";

export async function GET() {
  const uniqueId = generateUniqueId();
  addCodeCache(uniqueId, "123");
  return NextResponse.json({
    url: "https://gimg3.baidu.com/search/src=http%3A%2F%2Fpics6.baidu.com%2Ffeed%2Fcaef76094b36acafaa672607f2e5521d00e99c14.jpeg%40f_auto%3Ftoken%3Db61ed618b8f25d0dd68077290ce098be&refer=http%3A%2F%2Fwww.baidu.com&app=2021&size=f360,240&n=0&g=0n&q=75&fmt=auto?sec=1713459600&t=ffe7cd43f00808e719c5eb9cd735ab97",
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
