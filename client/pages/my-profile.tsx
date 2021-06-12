import Head from "next/head";
import React from "react";
import Header from "../components/header";

export default function MyProfile() {
  return (
    <div className="min-h-screen h-auto w-screen max-w-full bg-gray-100 ">
      <Head>
        {typeof window !== "undefined" && (
          <title>Strugl - {localStorage.getItem("username")}</title>
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen grid grid-cols-4 px-4 m-auto gap-4 justify-between pb-4"></div>
    </div>
  );
}
