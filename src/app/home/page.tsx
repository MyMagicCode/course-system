"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session && session.user) {
    console.log("session.user", session?.user);
    return (
      <button onClick={() => signOut()}>{session.user.name} Sign Out</button>
    );
  }

  return <button onClick={() => signIn()}>SignIn</button>;
}
