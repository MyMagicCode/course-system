"use client";
import { useEffect, useState } from "react";
import { DataProvider } from "./DataContext";
import Child from "./Child";
import { useSession } from "next-auth/react";

export default function Demo({ text }: { text: string }) {
  const [str, setStr] = useState(text);
  const session = useSession();

  useEffect(() => {
    setTimeout(() => {
      setStr("你好呀，客服端组件");
    }, 2000);
  }, []);

  const handleClick = async () => {
    try {
      const data = await fetch("api/time");
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <DataProvider>
      <h1>{str}</h1>
      <button onClick={handleClick}>获取token</button>
      <pre>{JSON.stringify(session)}</pre>
      <Child></Child>
    </DataProvider>
  );
}
