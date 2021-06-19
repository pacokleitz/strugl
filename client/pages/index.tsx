import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";
import { useEffect } from "react";

import LogIn from "./login";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   if (localStorage.getItem("username")) {
  //     router.push("/dashboard", '/')
  //   } else router.push("/login", '/');
  // }, []);

  return (
    <div className="w-screen h-screen">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
