import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";
import { useEffect } from "react";

import LogIn from "./login";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("https://api.strugl.cc/api/users/me", {
      method: "Get",
    }).then(async (res) => {
      const text = await res.text();
      if (res.ok && typeof window !== "undefined") {
        localStorage.setItem("username", text);
        router.push("/dashboard", "/");
      } else {
        console.clear();
        router.push("/login", "/");
      }
    });
  }, []);

  return (
    <div className="w-screen h-screen">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
