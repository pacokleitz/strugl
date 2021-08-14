import { NextPageContext } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { auth } from "../redux/reducers/CurrentUserSlice";

import User from "../lib/user";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    if (!currentUser.username) {
      fetch("https://api.strugl.cc/api/users/me", {
        method: "Get",
        credentials: "include",
      }).then(async (res) => {
        const text = await res.text();
        if (res.ok) {
          dispatch(auth(new User(0, text, "")));
          router.push("/dashboard", "/");
        } else {
          console.clear();
          router.push("/login", "/");
        }
      });
    } else router.push("/dashboard", "/");
  }, []);

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
