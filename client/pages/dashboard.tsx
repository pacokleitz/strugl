import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppSelector } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";

export default function Dashboard({ postsList }: any) {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser.username.length == 0 || postsList == "Invalid")
      router.push("/");
  });

  return (
    <div className="min-h-screen w-screen max-w-full bg-gray-100 overflow-hidden">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen lg:grid lg:grid-cols-4 pt-16 px-4 m-auto gap-4 justify-between">
        <div className="lg:block hidden">
          <Profile />
        </div>
        <Feed feedType="dashboardFeed" postsList={postsList} />
        <div className="lg:block hidden">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  // feed fetch
  const res = await fetch(`https://api.strugl.cc/posts/feed`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.ok) {
    const json = await res.json();
    return { postsList: json };
  } else return { postsList: "Invalid" };
};
