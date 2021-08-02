import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";

export default function Dashboard(context: any) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined")
      if (!localStorage.getItem("username")) router.push("/");
  });

  return (
    <div className="max-h-screen w-screen max-w-full bg-gray-100 overflow-hidden pb-24">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen grid grid-cols-4 pt-16 px-4 m-auto gap-4 justify-between pb-24">
        <Profile />
        <Feed feedType="dashboardFeed"/>
        <Suggestions />
      </div>
    </div>
  );
}

// Dashboard.getInitialProps = async (ctx:any) => {
//     // posts
//   fetch("https://api.strugl.cc/posts/", {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   }).then(async (res) => {
//     const json = await res.json();
//     if (res.ok) {
//       let feed = json.posts;
//     } else alert(json.error);
//   });

//   fetch("https://api.strugl.cc", {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({}),
//   }).then(async (res) => {
//     const json = await res.json();
//     if (res.ok) {
//       chat = json.chats;
//     } else alert(json.error);
//   });
//};
