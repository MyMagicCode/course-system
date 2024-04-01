import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const revalidate = 10;

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  return Response.json({ data: new Date().toLocaleTimeString(), token });
}
