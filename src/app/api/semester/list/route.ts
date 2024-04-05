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
    label,
  } = Object.fromEntries(searchParams);

  const [list, meta] = await prisma.semester
    .paginate({
      where: {
        label: {
          contains: label,
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
    results: list.map(({ beginDate, endDate, createdAt, ...other }) => {
      return {
        ...other,
        beginDate: dayjs(beginDate).format("YYYY-MM-DD"),
        endDate: dayjs(endDate).format("YYYY-MM-DD"),
        createdAt: dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      };
    }),
    total: meta.totalCount,
    currentPage: meta.currentPage,
    pageCount: meta.pageCount,
  };

  return NextResponse.json(data);
}
