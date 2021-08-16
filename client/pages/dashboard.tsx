import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";
import { auth, logOut } from "../redux/reducers/CurrentUserSlice";
import Topic from "../lib/topic";

export default function Dashboard({
  postsList,
  topicsList,
  usersList,
  interestsList,
  followingsList,
  currentUser,
}: any) {
  const dispatch = useAppDispatch();
  const [interests, setInterestsList] = useState(interestsList);
  const [followings, setFollowingsList] = useState(followingsList);
  const [usersRecom, setUsersList] = useState(usersList);
  const [topicsRecom, setTopicsList] = useState(topicsList);

  useEffect(() => {
    dispatch(auth(currentUser));
    setInterestsList(interestsList);
    setFollowingsList(followingsList);
    setUsersList(usersList);
    setTopicsList(topicsList);
  });

  async function UpdateTopicsList() {
    await fetch(`https://api.strugl.cc/recom/topics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then(async (res) => {
      let json = await res.json();
      setTopicsList(json);
    });
  }

  async function UpdateUsersList() {
    await fetch(`https://api.strugl.cc/recom/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).then(async (res) => {
      let json = await res.json();
      setTimeout(() => {
        setUsersList(json);
      }, 2000);
    });
  }

  function UpdateInterestsList(topic: Topic) {
    setInterestsList((arr: []) => [
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
          <Profile
            interestsList={interests}
            followingsList={followings}
            user={currentUser}
          />
        </div>
        <Feed feedType="dashboardFeed" postsList={postsList} />
        <div className="lg:block hidden">
          <Suggestions
            usersList={usersRecom}
            topicsList={topicsRecom}
            updateUsersFunction={UpdateUsersList}
            updateTopicsFunction={UpdateTopicsList}
            UpdateInterestsFunction={UpdateInterestsList}
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
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const currentUser = await res.json();

  res = await fetch(`https://api.strugl.cc/followings/${currentUser.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const followings = await res.json();

  res = await fetch(`https://api.strugl.cc/interests/${currentUser.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const interests = await res.json();

  return {
    postsList: feed,
    topicsList: topics,
    usersList: users,
    followingsList: followings,
    interestsList: interests,
    currentUser: currentUser,
  };
};
