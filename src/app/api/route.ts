import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  // 1.新增
  // const user = await prisma.user.create({
  //   data: {
  //     name: "东东东",
  //     email: "dongdong@dong.com",
  //     posts: {
  //       create: [
  //         {
  //           title: "aaa",
  //           content: "aaaa",
  //         },
  //         {
  //           title: "bbb",
  //           content: "bbbb",
  //         },
  //       ],
  //     },
  //   },
  // });
  // 2.更新
  // await prisma.post.update({
  //   where: {
  //     id: 2,
  //   },
  //   data: {
  //     content: "xxx",
  //   },
  // });
  // 3.删除
  // await prisma.post.delete({
  //   where: {
  //     id: 2,
  //   },
  // });
  prisma.user.create({
    data: {
      name: "12312",
      email: "",
    },
  });
  const list = await prisma.post.findMany();
  return NextResponse.json(list);
}
