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
  await prisma.user.createMany({
    data: [
      {
        name: "admin",
        account: "admin",
        password: "0192023a7bbd73250516f069df18b500", // md5加密后数据
      },
    ],
  });
}

main().finally(() => {
  prisma.$connect();
});
