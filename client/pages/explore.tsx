import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { GetCurrentUser } from "../services/data";

import Header from "../components/header";
import { updateSearch } from "../redux/reducers/SearchSlice";

export default function Explore() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);

  useEffect(() => {
    GetCurrentUser(dispatch);
    if (!isLogged) router.push("/login", "/");
  });

  return (
    <div
      className="h-screen w-screen max-w-full bg-gray-100 dark:bg-gray-950"
      onClick={() => dispatch(updateSearch([]))}
    >
      <Head>
        <title>Strugl - Explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="h-screen pt-16 max-w-full w-screen px-4 m-auto justify-center pb-4">
        <div className="h-full rounded-xl flex flex-col space-y-4 justify-items-center text-center justify-center">
          <img src="/duckbutticon.svg" className="h-1/4 " />
          <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 subpixel-antialiased">
            Coming soon ...
          </p>
        </div>
      </div>
    </div>
  );
}
