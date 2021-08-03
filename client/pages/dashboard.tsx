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
  const currentUser = useAppSelector((state) => state.users.currentUser);

  useEffect(() => {
    if (!currentUser) router.push("/");
  });

  return (
    <div className="max-h-screen w-screen max-w-full bg-gray-100 overflow-hidden pb-24">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen grid grid-cols-4 pt-20 px-4 m-auto gap-4 justify-between pb-24">
        <Profile />
        <Feed feedType="dashboardFeed" postsList={postsList} />
        <Suggestions />
      </div>
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  // feed fetch
  const res = await fetch(`https://api.strugl.cc/posts/user/paco`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return { postsList: json };
};
