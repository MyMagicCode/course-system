import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

interface Params {
  code: string;
}

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Params }) {
  const { code } = params;
  let list: any[] = [];
  if (code in selector) {
    list = await selector[code as keyof typeof selector]();
  }

  return NextResponse.json(list);
}

const selector = {
  teachers: () =>
    prisma.teacher.findMany({
      where: {
        title: "FORMAL",
      },
    }),
  assistants: () =>
    prisma.teacher.findMany({
      where: {
        title: "DEPUTY",
      },
    }),
  classrooms: () => prisma.classroom.findMany({}),
  courseList: () =>
    prisma.course
      .findMany({
        include: {
          courseOnTeacher: {
            include: {
              teacher: true,
            },
          },
        },
      })
      .then((list) => {
        return list.map(({ courseOnTeacher, ...other }) => {
          const teacher = courseOnTeacher.find(
            (item) => item.teacher.title === "FORMAL"
          );
          return {
            ...other,
            teacherId: teacher?.teacherId,
          };
        });
      }),
};
