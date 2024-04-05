import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";
import dayjs from "dayjs";

const prisma = new PrismaClient().$extends(pagination());

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const {
    pageSize = "10",
    page = "1",
    name,
  } = Object.fromEntries(searchParams);

  const [list, meta] = await prisma.course
    .paginate({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        courseOnTeacher: {
          include: {
            teacher: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
    .withPages({
      limit: parseInt(pageSize),
      page: parseInt(page),
      includePageCount: true,
    });

  const data = {
    results: list.map(({ createdAt, courseOnTeacher, ...other }) => {
      const teacher = courseOnTeacher.find(
        (item) => item.teacher.title === "FORMAL"
      );
      const assistant = courseOnTeacher.find(
        (item) => item.teacher.title === "DEPUTY"
      );
      return {
        ...other,
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
        teacherId: teacher?.teacherId, // 老师信息
        teacherName: teacher?.teacher.name,
        assistantId: assistant?.teacherId, // 助教信息
        assistantName: assistant?.teacher.name,
      };
    }),
    total: meta.totalCount,
    currentPage: meta.currentPage,
    pageCount: meta.pageCount,
  };

  return NextResponse.json(data);
}
