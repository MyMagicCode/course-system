import { PrismaClient } from ".prisma/client";

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
        name: "zhang1",
        email: "1523@email.com",
      },
      {
        name: "wang",
        email: "144523@email.com",
      },
      {
        name: "li",
        email: "17823@email.com",
      },
      {
        name: "foo",
        email: "12963@email.com",
      },
      {
        name: "zhang2",
        email: "17823@email.com",
      },
      {
        name: "zhang3",
        email: "112323@email.com",
      },
      {
        name: "zhang4",
        email: "121333@email.com",
      },
    ],
  });
}

main().finally(() => {
  prisma.$connect();
});
