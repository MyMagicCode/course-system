import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";
import dayjs from "dayjs";
import { groupByArray } from "@/utils/tools";

const prisma = new PrismaClient().$extends(pagination());

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const {
    pageSize = "10",
    page = "1",
    name,
    date,
  } = Object.fromEntries(searchParams);

  const [list, meta] = await prisma.classroom
    .paginate({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        Schedules: {
          include: {
            course: true,
            exam: true,
          },
          where: {
            whenDay: new Date(date),
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
    .withPages({
      limit: parseInt(pageSize),
      page: parseInt(page),
      includePageCount: true,
    });

  const data = {
    results: list.map(({ createdAt, Schedules, ...other }) => {
      const scheduleList = groupByArray(
        Schedules,
        (item) => item.courseBegin || item.examBegin! + item.examEnd
      )[0].map((item) => {
        const { course, exam, ...other2 } = item[0];
        return {
          ...other2,
          courseName: course?.name,
          examName: exam?.name,
          num: item.length,
        };
      });
      return {
        ...other,
        scheduleList,
        whenDay: date,
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    }),
    total: meta.totalCount,
    currentPage: meta.currentPage,
    pageCount: meta.pageCount,
  };

  return NextResponse.json(data);
}
