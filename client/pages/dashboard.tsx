import React, { useEffect } from "react";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import Header from "../components/header";
import Feed from "../components/feed";
import Profile from "../components/profile";
import Suggestions from "../components/suggestions";
import {
  GetCurrentUser,
  GetFeed,
  GetTopicsRecom,
  GetUsersRecom,
} from "../services/data";
import { useRouter } from "next/router";
import { updateSearch } from "../redux/reducers/SearchSlice";
import Alert from "../components/alert";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const feed = useAppSelector((state) => state.feed);
  const alert = useAppSelector((state) => state.alerts.list[0]);

  useEffect(() => {
    GetCurrentUser(dispatch);
    if (!isLogged) router.push("/login", "/");
    else {
      dispatch(updateSearch([]));
      GetFeed(dispatch);
      GetUsersRecom(dispatch);
      GetTopicsRecom(dispatch);
    }
  }, []);

  return (
    <div
      className="md:h-screen min-h-screen w-screen max-w-full bg-gray-100 dark:bg-gray-950 overflow-hidden p-2"
      onClick={() => dispatch(updateSearch([]))}
    >
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen lg:grid lg:grid-cols-4 pt-16 px-4 m-auto gap-4 justify-between">
        {alert && <Alert alert={alert} />}
        <div className="lg:block hidden">
          <Profile />
        </div>
        <Feed feed={feed} />
        <div className="lg:block hidden">
          <Suggestions />
        </div>
      </div>
    </div>
  );
}
