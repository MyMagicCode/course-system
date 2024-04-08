"use client";
import { SessionProvider } from "next-auth/react";
import { StyleProvider } from "@ant-design/cssinjs";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";
import { ConfigProvider } from "antd";
dayjs.locale("zh-cn");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider locale={locale}>
        <SessionProvider>{children}</SessionProvider>;
      </ConfigProvider>
    </StyleProvider>
  );
}
