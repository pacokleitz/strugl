import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";
import { logOut } from "../redux/reducers/CurrentUserSlice";

export default function Dashboard({
  postsList,
  topicsList,
  usersList,
  usersError,
  feedError,
  topicsError,
}: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    console.log(
      postsList,
      topicsList,
      usersList,
      usersError,
      feedError,
      topicsError
    );
    // if (feed.error) {
    //   dispatch(logOut());
    //   router.push("/");
    // }
  });

  return (
    <div className="md:h-screen min-h-screen w-screen max-w-full bg-gray-100 overflow-hidden">
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
          <Suggestions usersList={usersList} topicsList={topicsList} />
        </div>
      </div>
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  let feed;
  let topics;
  let users;

  // feed fetch
  let res = await fetch(`https://api.strugl.cc/posts/user/test2`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.ok) {
    const json = await res.json();
    feed = { postsList: json };
  } else feed = { feedError: true };

  // Suggestions fetch

  res = await fetch(`https://api.strugl.cc/recom/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.ok) {
    const json = await res.json();
    topics = { topicsList: json };
  } else topics = { topicsError: true };

  res = await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (res.ok) {
    const json = await res.json();
    users = { usersList: json };
  } else users = { usersError: true };

  return { feed, topics, users };
};
