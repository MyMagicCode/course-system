import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
  ],
});

async function main() {
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       name: "admin",
  //       account: "admin",
  //       password: "0192023a7bbd73250516f069df18b500", // md5加密后数据
  //     },
  //   ],
  // });

  await prisma.semester.createMany({
    data: [
      {
        label: "2024年度上期",
        beginDate: new Date("2024-01-28"),
        endDate: new Date("2024-06-23"),
      },
      {
        label: "2024年度下期",
        beginDate: new Date("2024-09-28"),
        endDate: new Date("2024-12-23"),
      },
      {
        label: "2024年度上期",
        beginDate: new Date("2024-01-28"),
        endDate: new Date("2024-06-23"),
      },
      {
        label: "2024年度下期",
        beginDate: new Date("2024-09-28"),
        endDate: new Date("2024-12-23"),
      },
      {
        label: "2024年度上期",
        beginDate: new Date("2024-01-28"),
        endDate: new Date("2024-06-23"),
      },
      {
        label: "2024年度下期",
        beginDate: new Date("2024-09-28"),
        endDate: new Date("2024-12-23"),
      },
      {
        label: "2024年度上期",
        beginDate: new Date("2024-01-28"),
        endDate: new Date("2024-06-23"),
      },
      {
        label: "2024年度下期",
        beginDate: new Date("2024-09-28"),
        endDate: new Date("2024-12-23"),
      },
      {
        label: "2024年度上期",
        beginDate: new Date("2024-01-28"),
        endDate: new Date("2024-06-23"),
      },
      {
        label: "2024年度下期",
        beginDate: new Date("2024-09-28"),
        endDate: new Date("2024-12-23"),
      },
    ],
  });
}

main().finally(() => {
  prisma.$connect();
});
