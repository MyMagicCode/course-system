import { MiddlewareConfig } from "next/dist/build/analysis/get-page-static-info";
import { NextResponse } from "next/server";

export function middleware(req: Request) {
  return NextResponse.redirect(new URL("/home", req.url));
}

// 设置匹配路径
export const config = {
  matcher: "/about/:path*",
};
