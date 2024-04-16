import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { groupByArray } from "@/utils/tools";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = await getToken({ req: request });

  const { startDate, endDate, teacherId } = Object.fromEntries(searchParams);
  const numberId = parseInt(teacherId);
  const role = token?.role;
  let courseIds: number[] | undefined = undefined;

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: {
        userId: parseInt(token?.id as string),
      },
    });
    const courses = await prisma.studentCourse.findMany({
      where: {
        studentId: student?.id,
      },
    });
    courseIds = courses.map((it) => it.courseId);
  }

  const calcTeacherId =
    role === "STUDENT" ? undefined : numberId || token?.teacherId || null;

  const list = await prisma.schedules.findMany({
    where: {
      whenDay: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      type: "COURSE",
      teacherId: calcTeacherId,
      courseId: {
        in: courseIds,
      },
    },
    include: {
      course: true,
      classroom: true,
    },
    orderBy: {
      courseBegin: "asc",
    },
  });

  const groupList = groupByArray(
    list,
    (item) => dayjs(item.whenDay).format("YYYY-MM-DD") + item.courseBegin!
  )[0].map((item) => {
    const { course, classroom, whenDay, ...other } = item[0];
    const content = `${course?.name}@${classroom.name}(${other.courseBegin}-${
      other.courseBegin! + item.length - 1
    })`;
    return {
      ...other,
      content,
      whenDay: dayjs(whenDay).format("YYYY-MM-DD"),
      num: item.length,
    };
  });

  return NextResponse.json({ results: groupList });
}
