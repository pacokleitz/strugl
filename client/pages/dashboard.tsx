import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppDispatch } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";
import User from "../lib/user";
import { auth } from "../redux/reducers/CurrentUserSlice";

export default function Dashboard({ postsList }: any) {
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
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Check token
  await fetch("https://api.strugl.cc/api/users/me", {
    method: "Get",
    credentials: "include",
  }).then(async (res) => {
    const text = await res.text();
    if (res.ok) {
      dispatch(auth(new User(0, text, "")));
    } else router.push("/");
  });

  // feed fetch
  const res = await fetch(`https://api.strugl.cc/posts/user/paco`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return { postsList: json };
};
