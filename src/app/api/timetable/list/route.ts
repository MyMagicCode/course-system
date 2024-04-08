import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { groupByArray } from "@/utils/tools";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const { startDate, endDate } = Object.fromEntries(searchParams);

  const list = await prisma.schedules.findMany({
    where: {
      whenDay: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      type: "COURSE",
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
