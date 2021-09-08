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

    GetCurrentUser(dispatch)
      .then(() => {
        if (isLogged) {
          Promise.all([
            // router.prefetch("/dashboard", "/"),
            GetFeed(dispatch),
            GetUsersRecom(dispatch),
            GetTopicsRecom(dispatch),
          ])
            .then(() => {
              router.push("/dashboard", "/");
            })
            .catch((err) => {
              console.log(err);
              router.push("/login", "/");
            });
        } else {
          router.push("/login", "/");
        }
      })
      .catch((err) => {
        console.log(err);
        router.push("/login", "/");
      });
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-gray-950">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full w-screen grid place-content-center gap-4 text-center">
        <img src="favicon.ico" className="w-1/3 justify-self-center" />
        <p className="animate-pulse text-3xl font-semibold text-gray-500 dark:text-gray-400 ">
          Loading ...
        </p>
      </div>
    </div>
  );
}
