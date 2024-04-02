"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Layout, Menu } from "antd";
const { Header: AHeader } = Layout;

const menuList = [
  {
    key: "/semester",
    label: "学期",
  },
  {
    key: "/course",
    label: "课程",
  },
  {
    key: "/exam",
    label: "考试",
  },
  {
    key: "/teaching-schedule",
    label: "排课",
  },
  {
    key: "/exam-arrangements",
    label: "考试排期",
  },
];

export default function Header() {
  // 获取user对象
  const { data: session } = useSession();
  const pathname = usePathname();
  const handleClick = (item: any) => {};
  return (
    <Layout>
      <AHeader>
        <Menu
          onClick={handleClick}
          selectedKeys={[pathname]}
          mode="horizontal"
          items={menuList}
          style={{ flex: 1, minWidth: 0 }}
        />
      </AHeader>
    </Layout>
  );
}
{
  /* <Navbar maxWidth="full" classNames={{ base: "shadow-md" }}>
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
            variant="flat">
            Sign Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar> */
}
