"use client";
import React, { PropsWithChildren } from "react";
import type { MenuProps } from "antd";
import { Button, Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const { Header, Content } = Layout;

export default function ManageLayout({ children }: PropsWithChildren) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    router.push(key);
  };
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div className="demo-logo">CSS</div>
        <div style={{ maxWidth: "400px" }}>
          <Menu
            theme="dark"
            onClick={handleClick}
            mode="horizontal"
            defaultSelectedKeys={[pathname]}
            items={menuList}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        <div className="user-info">
          Hi {session?.user?.name}!
          <Button type="primary" color="primary" href="/api/auth/signout">
            退出
          </Button>
        </div>
      </Header>
      <Content style={{ padding: "0 48px", minHeight: "calc(100vh - 64px)" }}>
        {children}
      </Content>
    </Layout>
  );
}

const menuList: MenuProps["items"] = [
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
    key: "/scheduling",
    label: "排期",
  },
];
