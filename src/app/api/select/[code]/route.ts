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
  // 正式老师列表
  teachers: () =>
    prisma.teacher.findMany({
      where: {
        title: "FORMAL",
      },
    }),
  // 助教老师列表
  assistants: () =>
    prisma.teacher.findMany({
      where: {
        title: "DEPUTY",
      },
    }),
  // 所有老师列表
  allTeachers: () => prisma.teacher.findMany(),
  // 教室列表
  classrooms: () => prisma.classroom.findMany({}),
  // 课程列表
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
  // 考试列表
  examList: () => prisma.exam.findMany(),
  // 学生列表
  studentList: () => prisma.student.findMany(),
};
