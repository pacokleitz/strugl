import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Feed from "../components/feed";
import Header from "../components/header";
import Suggestions from "../components/suggestions";
import Alert from "../components/alert";

import { faBookmark, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProfileContent(props: any) {
  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6 justify-start items-center space-x-8 focus:outline-none">
        <img
          src="default.svg"
          className="w-32 rounded-full bg-white ring-2 ring-gray-300 self-center"
        />
        <p className="inline-block text-xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
          {props.profile}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faUsers} className="w-5" />
            <p>Friends</p>
          </div>
          <p>28</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faStar} className="w-5" />
            <p>Interests</p>
          </div>
          <p>3</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon
              icon={faBookmark}
              className="w-5 h-4 self-center"
            />
            <p>Bookmarks</p>
          </div>
          <p>31</p>
        </a>
      </div>
      <div className="">
        <Feed feedType="profileFeed" postsList={props.postsList} />
      </div>
    </div>
  );
}

export default function Profile({ postsList }: any) {
  const router = useRouter();
  const { profile } = router.query;

  useEffect(() => {
    if (typeof window !== "undefined")
      if (!localStorage.getItem("username")) router.push("/");
  });

  return (
    <div className="fixed min-h-screen h-auto w-screen max-w-full bg-gray-100 ">
      <Head>
        {typeof window !== "undefined" && <title>Strugl - {profile}</title>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {!postsList &&
        typeof window !== "undefined" &&
        profile == localStorage.getItem("username") && (
          <Alert
            state="suggestion"
            msg="You have no post yet. Create a new post to fill your profile"
            color="blue"
          />
        )}
      <div className="pt-16 max-w-full w-screen grid grid-cols-4 px-4 m-auto gap-8 justify-between pb-4">
        <ProfileContent postsList={postsList} profile={profile} />
        <Suggestions />
      </div>
    </div>
  );
}

Profile.getInitialProps = async (ctx: any) => {
  const res = await fetch(
    `https://api.strugl.cc/posts/user/${ctx.query.profile}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await res.json();
  return { postsList: json };
};
