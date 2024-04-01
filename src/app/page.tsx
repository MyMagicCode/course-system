import { getServerSession } from "next-auth/next";
import type { NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, Button } from "@nextui-org/react";

export default async function Protected(req: NextRequest): Promise<any> {
  // 获取user对象
  const session = await getServerSession(authOptions);
  console.log("session", session);
  return (
    <div className="grid grid-cols-2 p-4">
       <Avatar color="primary" name="Junior" />
       <Button>Click me</Button>
      <div>
        {session !== null ? (
          <h1 className="leading-loose text-[2rem] font-extrabold text-accent">
            Hi {session?.user?.name}!
            <a className="btn btn-primary" href="/api/auth/signout">
              Sign out
            </a>
          </h1>
        ) : (
          <a className="btn btn-primary" href="/api/auth/signin">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
