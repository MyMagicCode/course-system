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

  const [list, meta] = await prisma.exam
    .paginate({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        position: true,
        course: true,
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
    results: list.map(({ createdAt, position, course, ...other }) => {
      return {
        ...other,
        position: position.name,
        courseName: course.name,
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    }),
    total: meta.totalCount,
    currentPage: meta.currentPage,
    pageCount: meta.pageCount,
  };

  return NextResponse.json(data);
}
