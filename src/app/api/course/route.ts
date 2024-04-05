import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export async function POST(req: Request) {
  const { id, name, describe, credit, studyHours, assistantId, teacherId } =
    await req.json();

  const data = {
    name,
    describe,
    credit,
    studyHours,
  };
  const res = {
    status: 200,
    msg: "操作成功",
  };
  try {
    if (id) {
      // 修改数据
      // 删除原有教师关系
      const del = prisma.courseOnTeacher.deleteMany({
        where: {
          courseId: id,
        },
      });
      // 添加教师关系
      const create = [
        {
          teacherId,
        },
      ];
      // 添加助教关系
      if (assistantId) {
        create.push({
          teacherId: assistantId,
        });
      }
      const update = prisma.course.update({
        where: {
          id,
        },
        data: {
          ...data,
          courseOnTeacher: {
            create,
          },
        },
      });

      prisma.$transaction([del, update]);
    } else {
      // 新增数据
      // 添加教师关系
      const create = [
        {
          teacherId,
        },
      ];
      // 添加助教关系
      if (assistantId) {
        create.push({
          teacherId: assistantId,
        });
      }
      await prisma.course.create({
        data: {
          ...data,
          courseOnTeacher: {
            create,
          },
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
    // 删除原有教师关系
    const delMN = prisma.courseOnTeacher.deleteMany({
      where: {
        courseId: id,
      },
    });
    const del = prisma.course.delete({
      where: {
        id,
      },
    });

    prisma.$transaction([delMN, del]);
  } catch (error) {
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}
