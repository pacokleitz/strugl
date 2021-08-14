import { useRouter } from "next/router";
import Head from "next/head";
import React from "react";

import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import { auth } from "../redux/reducers/CurrentUserSlice";

import User from "../lib/user";
import { NextPageContext } from "next";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="w-screen h-screen">
        <Head>
          <title>Strugl</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
    </Provider>
  );
}

Home.getInitialProps = async (ctx: NextPageContext) => {
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
      router.push("/dashboard", "/");
    } else router.push("/login", "/");
  });
};
