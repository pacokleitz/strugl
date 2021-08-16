import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";
import { logOut } from "../redux/reducers/CurrentUserSlice";
import Topic from "../lib/topic";

export default function Dashboard({
  postsList,
  topicsList,
  usersList,
  followersList,
  followingsList,
}: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);

  const [followings, setFollowingsList] = useState(followingsList);
  const [users, setUsersList] = useState(usersList);
  const [topics, setTopicsList] = useState(topicsList);

  useEffect(() => {
    // if (feed.error) {
    //   dispatch(logOut());
    //   router.push("/");
    // }
    setFollowingsList(followingsList);
    setUsersList(usersList);
    setTopicsList(topicsList);
  });

  function UpdateTopicsList() {}

  function UpdateUsersList() {}

  function UpdateFollowingsList(topic: Topic) {
    setFollowingsList((arr: []) => [
      {
        topic_id: topic.topic_id,
        topic_name: topic.topic_name,
        style: "state2",
      },
      ...arr,
    ]);
  }

  return (
    <div className="md:h-screen min-h-screen w-screen max-w-full bg-gray-100 overflow-hidden">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen lg:grid lg:grid-cols-4 pt-16 px-4 m-auto gap-4 justify-between">
        <div className="lg:block hidden">
          <Profile followersList={followersList} followingsList={followings} />
        </div>
        <Feed feedType="dashboardFeed" postsList={postsList} />
        <div className="lg:block hidden">
          <Suggestions
            usersList={users}
            topicsList={topics}
            updateUsersFunction={UpdateUsersList}
            updateTopicsFunction={UpdateTopicsList}
            UpdateFollowingsList={UpdateFollowingsList}
          />
        </div>
      </div>
    </div>
  );
}

Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  // feed fetch
  let res = await fetch(`https://api.strugl.cc/posts/feed`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const feed = await res.json();

  // Suggestions fetch
  res = await fetch(`https://api.strugl.cc/recom/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const topics = await res.json();

  res = await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const users = await res.json();

  // profile infos fetch
  res = await fetch("https://api.strugl.cc/users/me", {
    method: "Get",
    credentials: "include",
  });
  const currentUser = await res.json();

  res = await fetch(`https://api.strugl.cc/followers/${currentUser.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const followers = await res.json();

  res = await fetch(`https://api.strugl.cc/followings/${currentUser.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const followings = await res.json();

  return {
    postsList: feed,
    topicsList: topics,
    usersList: users,
    followersList: followers,
    followingsList: followings,
    currentUser: currentUser,
  };
};
