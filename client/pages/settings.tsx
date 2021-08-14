import Header from "../components/header";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../redux/hooks";
import { NextPageContext } from "next";
import { auth } from "../redux/reducers/CurrentUserSlice";
import User from "../lib/user";

export default function Settings() {
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

Settings.getInitialProps = async (ctx: NextPageContext) => {
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
};
