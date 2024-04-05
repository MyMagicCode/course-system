import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, label, endDate, beginDate } = await req.json();

  const data = {
    label,
    endDate: new Date(endDate),
    beginDate: new Date(beginDate),
  };
  const res = {
    status: 200,
    msg: "操作成功",
  };
  try {
    if (id) {
      // 修改数据
      await prisma.semester.update({
        where: {
          id,
        },
        data,
      });
    } else {
      // 新增数据
      await prisma.semester.create({
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
    await prisma.semester.delete({
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
