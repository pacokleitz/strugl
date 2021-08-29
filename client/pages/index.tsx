import Head from "next/head";
import React, { useEffect } from "react";

import { Provider } from "react-redux";
import store from "../redux/store";
import { useAppDispatch } from "../redux/hooks";

import { useRouter } from "next/router";
import { GetCurrentUser } from "../services/data";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    GetCurrentUser(dispatch);
    router.push("/dashboard", "/");
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
