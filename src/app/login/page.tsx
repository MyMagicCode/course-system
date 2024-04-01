"use client";

//...
import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const payload = Object.fromEntries(data);
      const res = await signIn("credentials", {
        ...payload,
        redirect: false,
      });
    } catch (e) {
      console.log("e", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">登录</button>
    </form>
  );
}
