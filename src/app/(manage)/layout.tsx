"use client";
import React, { PropsWithChildren } from "react";
import type { MenuProps } from "antd";
import { Button, Layout, Menu } from "antd";
import { signOut, useSession } from "next-auth/react";
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

  const handleExit = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div className="text-zinc-100 mr-4">排课系统</div>
        <div style={{ maxWidth: "600px" }}>
          <Menu
            theme="dark"
            onClick={handleClick}
            mode="horizontal"
            defaultSelectedKeys={[pathname]}
            items={menuList}
            style={{ flex: 1, minWidth: 0 }}
          />
        </div>
        <div>
          <span className="text-zinc-100 mr-4">Hi {session?.user?.name}!</span>
          <Button type="primary" color="primary" onClick={handleExit}>
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
    key: "/timetable",
    label: "课程表",
  },
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
