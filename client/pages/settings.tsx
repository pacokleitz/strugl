import Header from "../components/header";
import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "../redux/hooks";

export default function Settings() {
  const router = useRouter();

  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser.username) router.push("/");
  });

  return (
    <div className="min-h-screen h-auto w-screen max-w-full bg-gray-100 ">
      <Head>
        <title>Strugl - Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="pt-20 max-w-full w-screen grid grid-cols-4 px-4 m-auto gap-4 justify-between pb-4"></div>
    </div>
  );
}
