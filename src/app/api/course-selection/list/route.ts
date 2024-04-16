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

  const [list, meta] = await prisma.student
    .paginate({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        StudentCourse: {
          include: {
            course: true,
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
    results: list.map(({ createdAt, StudentCourse, ...other }) => {
      return {
        ...other,
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
        courses: StudentCourse.map((it) => it.course),
      };
    }),
    total: meta.totalCount,
    currentPage: meta.currentPage,
    pageCount: meta.pageCount,
  };

  return NextResponse.json(data);
}
