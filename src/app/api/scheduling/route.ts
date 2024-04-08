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
  examBegin?: string | null;
  examEnd?: string | null;
  teacherIds?: string | null;
  studentIds?: string | null;
  teacherId?: number;
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
    const {
      type,
      courseBegin = 1,
      courseId,
      num,
      whenDay,
      teacherId,
      examBegin,
      examEnd,
      examId,
      teacherIds,
      studentIds,
    } = item;
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
    } else if (type === "EXAM") {
      list.push({
        type,
        classroomId: id!,
        whenDay: new Date(whenDay),
        examBegin: examBegin as string,
        examEnd,
        examId,
        teacherIds: teacherIds as string,
        studentIds: studentIds as string,
      });
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
    console.log(error);
    res.status = 400;
    res.msg = JSON.stringify(error);
  }

  return NextResponse.json(res);
}
