import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, name, courseId, classroomId, minutes } = await req.json();

  const data = {
    name,
    courseId,
    classroomId,
    minutes,
  };
  const res = {
    status: 200,
    msg: "操作成功",
  };
  try {
    if (id) {
      // 修改数据
      await prisma.exam.update({
        where: {
          id,
        },
        data,
      });
    } else {
      // 新增数据
      await prisma.exam.create({
        data,
      });
    }
  } catch (error) {
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const res = {
    status: 200,
    msg: "操作成功",
  };

  if (!id)
    return new Response("id不能为空", {
      status: 400,
    });

  try {
    await prisma.exam.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}
