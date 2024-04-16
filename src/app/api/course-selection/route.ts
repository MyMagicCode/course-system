import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

export async function POST(req: Request) {
  const { id, courseIds } = await req.json();

  const res = {
    status: 200,
    msg: "操作成功",
  };
  try {
    if (id) {
      const scheduling = await prisma.schedules.findMany({
        where: {
          courseId: {
            in: courseIds || [],
          },
        },
      });

      // 判断是否有冲突
      const timeSet = new Set<string>();
      for (const it of scheduling) {
        const time = dayjs(it.whenDay).format("YYYY-MM-DD") + it.courseNum;
        if (timeSet.has(time)) {
          // 有相同的时间冲突
          throw "选择课程时间冲突，选课失败！";
        } else {
          timeSet.add(time);
        }
      }
      // 修改数据
      // 删除原有选课关系
      const del = prisma.studentCourse.deleteMany({
        where: {
          studentId: id,
        },
      });
      const update = prisma.studentCourse.createMany({
        data: courseIds.map((courseId: number) => ({
          courseId,
          studentId: id,
        })),
      });

      prisma.$transaction([del, update]);
    }
  } catch (error) {
    console.log("error", error);
    res.status = 400;
    res.msg = typeof error === "string" ? error : JSON.stringify(error);
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

    await prisma.$transaction([delMN, del]);
  } catch (error) {
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}
