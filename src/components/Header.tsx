"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const menuList = [
  {
    path: "/semester",
    title: "学期",
  },
  {
    path: "/course",
    title: "课程",
  },
  {
    path: "/exam",
    title: "考试",
  },
  {
    path: "/teaching-schedule",
    title: "排课",
  },
  {
    path: "/exam-arrangements",
    title: "考试排期",
  },
];

export default function Header() {
  // 获取user对象
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <Navbar maxWidth="full" classNames={{ base: "shadow-md" }}>
      <NavbarBrand>
        <p className="font-bold text-inherit">CSS</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuList.map((item) => {
          return (
            <NavbarItem isActive={pathname === item.path} key={item.path}>
              <Link href={item.path} color="foreground">
                {item.title}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className=" lg:flex">
          <Link href="#">Hi {session?.user?.name}!</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/api/auth/signout"
            variant="flat"
          >
            Sign Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
