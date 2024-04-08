import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import dayjs from "dayjs";
import { ClassroomType } from "@/app/(manage)/scheduling/components/Classrooms";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

type SchedulesCreateManyInput = {
  // id?: number
  classroomId: number;
  examId?: number | null;
  courseId?: number | null;
  type: "COURSE" | "EXAM";
  whenDay: Date | string;
  courseBegin?: number | null;
  courseNum?: number | null;
  examBegin?: Date | string | null;
  examEnd?: Date | string | null;
  teacherIds?: string | null;
  studentIds?: string | null;
  teacherId: number;
};

export async function POST(req: Request) {
  const {
    id,
    whenDay,
    scheduleList = [],
  } = (await req.json()) as ClassroomType;

  const res = {
    status: 200,
    msg: "操作成功",
  };

  const list: SchedulesCreateManyInput[] = [];

  scheduleList.forEach((item) => {
    const { type, courseBegin = 1, courseId, num, whenDay, teacherId } = item;
    if (type === "COURSE") {
      for (let i = 0; i < num!; i++) {
        list.push({
          type,
          classroomId: id!,
          courseId,
          whenDay: new Date(whenDay),
          teacherId: teacherId!,
          courseBegin,
          courseNum: courseBegin + i,
        });
      }
    }
  });

  try {
    const cleanUp = prisma.schedules.deleteMany({
      where: {
        classroomId: id!,
        whenDay: new Date(whenDay),
      },
    });

    const add = prisma.schedules.createMany({
      data: list,
    });

    await prisma.$transaction([cleanUp, add]);
  } catch (error: any) {
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}
