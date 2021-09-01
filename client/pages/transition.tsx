import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  GetCurrentUser,
  GetFeed,
  GetTopicsRecom,
  GetUsersRecom,
} from "../services/data";

export default function Transition() {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const router = useRouter();

    useEffect(() => {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      GetCurrentUser(dispatch).then(() => {
        if (isLogged) {
          GetFeed(dispatch);
          GetUsersRecom(dispatch);
          GetTopicsRecom(dispatch);
          router.push("/dashboard", "/");
        } else {
          router.push("/login", "/");
          localStorage.clear();
        }
      });
    }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-950">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen lg:grid content-center self-center gap-4 m-auto justify-center text-center">
        <img src="favicon.ico" className="w-1/3 m-auto" />
        <p className="animate-pulse text-3xl font-semibold text-gray-500 dark:text-gray-400 ">
          Loading ...
        </p>
      </div>
    </div>
  );
}
