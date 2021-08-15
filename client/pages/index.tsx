import Head from "next/head";
import React, { useEffect } from "react";

import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { auth } from "../redux/reducers/CurrentUserSlice";

import { useRouter } from "next/router";
import { NextPageContext } from "next";

export default function Home({ user }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);

  useEffect(() => {
    if (currentUser.username.length == 0 && user == "Invalid") {
      router.push("/login", "/");
    } else {
      dispatch(auth(user));
      router.push("/dashboard", "/");
    }
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

Home.getInitialProps = async (ctx: NextPageContext) => {
  const res = await fetch("https://api.strugl.cc/users/me", {
    method: "Get",
    credentials: "include",
  });
  if (res.ok) {
    let json = await res.json();
    return { user: json };
  } else {
    return { user: "Invalid" };
  }
};
