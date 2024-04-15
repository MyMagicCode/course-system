import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, name, courseId, teacherId, password, account, role, title, age } =
    await req.json();

  const data = {
    name,
    courseId,
    teacherId,
    password,
    account,
    role,
  };
  const res = {
    status: 200,
    msg: "操作成功",
  };
  try {
    const field = id ? "update" : "create";
    const payload: Record<string, any> = {};
    if (role === "TEACHER") {
      payload.teacher = {
        [field]: {
          name,
          age,
          title,
        },
      };
    } else if (role === "STUDENT") {
      payload.student = {
        [field]: {
          name,
        },
      };
    }
    if (id) {
      // 修改数据
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...data,
          ...payload,
        },
      });
    } else {
      // 新增数据
      await prisma.user.create({
        data: {
          ...data,
          ...payload,
        },
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
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    res.status = 400;
    res.msg = "该用户有业务数据，无法删除";
  }

  return NextResponse.json(res);
}
