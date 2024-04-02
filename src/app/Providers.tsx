"use client";
import { SessionProvider } from "next-auth/react";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";
import { ConfigProvider } from "antd";
dayjs.locale("zh-cn");

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={locale}>
      <SessionProvider>{children}</SessionProvider>;
    </ConfigProvider>
  );
}
