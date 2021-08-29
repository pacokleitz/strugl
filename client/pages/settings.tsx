import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { GetCurrentUser } from "../services/data";

import Header from "../components/header";
import { updateSearch } from "../redux/reducers/SearchSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

function Account() {
  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  return (
    <div className="h-full col-span-3 md:p-8 p-2 w-full space-y-2 flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-700">
      <h1 className="text-3xl text-gray-700 font-medium dark:text-gray-100">
        Profile
      </h1>

      <div className="">
        <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
          Edit your profile informations here. Push the button to save the
          changes.
        </p>
        <div className="flex flex-row py-10 justify-evenly items-start space-x-8 focus:outline-none content-center">
          <div className="cursor-pointer group relative">
            {!currentUser.avatar && (
              <div className="min-w-52 rounded-full bg-gray-200 ring-2 ring-gray-200self-center" />
            )}
            {currentUser.avatar && (
              <img
                src={currentUser.avatar}
                className="w-52 rounded-full self-start bg-gray-200 ring-2 ring-gray-200"
              />
            )}
            <div className="origin-top -mt-12 ml-2 absolute bg-white dark:bg-gray-800 shadow border-2 border-gray-100 dark:border-gray-800 border-opacity-60 rounded-md p-1 w-min text-gray-700 dark:text-gray-200 group-hover:text-indigo-700">
              <FontAwesomeIcon icon={faEdit} className="w-6" />
            </div>
          </div>

          <div className="flex flex-col content-between gap-8 focus:outline-none max-w-sm w-full ">
            <div className="flex flex-col focus:outline-none">
              <label className="text-gray-600 dark:text-gray-400 font-medium text-md focus:outline-none">
                Username
              </label>
              <input
                value={currentUser.username}
                type="text"
                autoComplete="off"
                className="w-full overflow-y-scroll p-1 px-4 rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
                disabled
              ></input>
            </div>
            <div className="flex flex-col ">
              <label className="text-gray-600 dark:text-gray-400 font-medium text-md">
                Profile name
              </label>
              <input
                defaultValue={currentUser.profile_name}
                type="text"
                autoComplete="off"
                className="w-full p-1 px-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
              ></input>
            </div>
            <div className="flex flex-col ">
              <label className="text-gray-600 dark:text-gray-400 font-medium text-md">
                Email
              </label>
              <input
                defaultValue={""}
                type="email"
                autoComplete="off"
                className="w-full p-1 px-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
              ></input>
            </div>

            <div className="flex flex-col ">
              <label className="text-gray-600 dark:text-gray-400 font-medium text-md">
                Bio
              </label>
              <textarea
                defaultValue={currentUser.bio}
                autoComplete="off"
                className="w-full p-1 px-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
              ></textarea>
            </div>
          </div>
        </div>
        <input
          type="button"
          value="Update profile"
          className="px-4 py-2 text-center float-right mt-8 text-md font-semibold cursor-pointer rounded-3xl bg-gray-100 dark:bg-gray-900 border-2 border-gray-600 dark:border-gray-200 text-gray-600 dark:text-gray-100 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-500 dark:hover:border-indigo-500"
        />
      </div>
    </div>
  );
}

function Appearence() {
  const [currentTheme, setCurrentTheme] = useState(
    document.documentElement.classList.contains("dark") ? 1 : 0
  );

  return (
    <div className="h-full col-span-3 md:p-8 p-2 space-y-2 flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-700">
      <h1 className="text-3xl text-gray-700 dark:text-gray-100 font-medium">
        Theme
      </h1>
      <div className="flex md:flex-row flex-col justify-evenly gap-8 py-8">
        <div
          id="light"
          className={
            "md:w-full max-w-sm h-full ring-2 rounded-xl shadow-md divide-y-2 divide-gray-200 dark:divide-gray-700 cursor-pointer " +
            (currentTheme == 0 ? "ring-indigo-500" : "ring-gray-600")
          }
          onClick={() => {
            setCurrentTheme(0);
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
          }}
        >
          <div className="bg-gray-100 w-full p-1 rounded-t-xl">
            <div className="bg-white w-full rounded-xl h-6 flex flex-row gap-1">
              <div className="h-2 rounded-xl bg-indigo-200 w-1/5 self-center m-auto"></div>
              <div className="h-2 rounded-xl bg-gray-200 w-1/5 self-center m-auto"></div>
              <div className="h-2 rounded-xl bg-gray-300 w-1/5 self-center m-auto"></div>
            </div>
            <div className="py-2 flex flex-row justify-evenly">
              <div className="h-16 bg-gray-200 w-1/4 rounded"></div>
              <div className="h-36 bg-white w-1/3 rounded-lg p-2 space-y-1">
                <div className="h-2 w-full rounded-xl bg-gray-100"></div>
                <div className="h-2 w-2/3 rounded-xl bg-gray-200"></div>
                <div className="h-2 w-11/12 rounded-xl bg-gray-100"></div>
                <div className="h-2 w-full rounded-xl bg-gray-200"></div>
                <div className="h-2 w-10/12 rounded-xl bg-gray-100"></div>
                <div className="h-2 w-2/3 rounded-xl bg-gray-100"></div>
                <div className="h-2 w-full rounded-xl bg-gray-200"></div>
                <div className="h-2 w-full rounded-xl bg-gray-100"></div>
                <div className="h-2 w-1/3 rounded-xl bg-gray-200"></div>
                <div className="h-2 w-10/12 rounded-xl bg-gray-100"></div>
                <div className="h-2 w-full rounded-xl bg-gray-200"></div>
              </div>{" "}
              <div className="h-20 bg-gray-200 w-1/4 rounded"></div>
            </div>
          </div>
          <div className="w-full px-4 py-2 text-center dark:text-gray-100 text-md font-semibold ">
            Light mode
          </div>
        </div>
        <div
          id="dark"
          className={
            "md:w-full max-w-sm h-full ring-2 rounded-xl divide-y-2 divide-gray-200 dark:divide-gray-700 shadow-md cursor-pointer " +
            (currentTheme == 1 ? "ring-indigo-500" : "ring-gray-600")
          }
          onClick={() => {
            setCurrentTheme(1);
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
          }}
        >
          <div className="bg-gray-900 w-full p-1 rounded-t-xl">
            <div className="bg-gray-800 w-full rounded-xl h-6 flex flex-row gap-1">
              <div className="h-2 rounded-xl bg-indigo-500 w-1/5 self-center m-auto"></div>
              <div className="h-2 rounded-xl bg-gray-500 w-1/5 self-center m-auto"></div>
              <div className="h-2 rounded-xl bg-gray-600 w-1/5 self-center m-auto"></div>
            </div>
            <div className="py-2 flex flex-row justify-evenly">
              <div className="h-16 bg-gray-600 w-1/4 rounded"></div>
              <div className="h-36 bg-gray-800 w-1/3 rounded-lg p-2 space-y-1">
                <div className="h-2 w-full rounded-xl bg-gray-700"></div>
                <div className="h-2 w-2/3 rounded-xl bg-gray-700"></div>
                <div className="h-2 w-11/12 rounded-xl bg-gray-600"></div>
                <div className="h-2 w-full rounded-xl bg-gray-600"></div>
                <div className="h-2 w-10/12 rounded-xl bg-gray-700"></div>
                <div className="h-2 w-2/3 rounded-xl bg-gray-700"></div>
                <div className="h-2 w-full rounded-xl bg-gray-600"></div>
                <div className="h-2 w-full rounded-xl bg-gray-700"></div>
                <div className="h-2 w-1/3 rounded-xl bg-gray-600"></div>
                <div className="h-2 w-10/12 rounded-xl bg-gray-700"></div>
                <div className="h-2 w-full rounded-xl bg-gray-600"></div>
              </div>{" "}
              <div className="h-20 bg-gray-600 w-1/4 rounded"></div>
            </div>
          </div>
          <div className="w-full px-4 py-2 text-center dark:text-gray-100 text-md font-semibold ">
            Dark mode
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.currentUser.isLogged);

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    GetCurrentUser(dispatch);
    if (!isLogged) router.push("/login", "/");
  });

  return (
    <div
      className="min-h-screen h-full w-screen max-w-full bg-gray-100 dark:bg-gray-900"
      onClick={() => dispatch(updateSearch([]))}
    >
      <Head>
        <title>Strugl - Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="min-h-screen pt-16 max-w-5xl w-screen px-4 m-auto justify-center pb-4 grid md:grid-cols-4 grid-cols-1 gap-4 md:divide-x-2 divide-gray-200 dark:divide-gray-700">
        <div className="col-span-1 h-full grid md:grid-flow-row grid-flow-col content-start md:pt-20 justify-evenly md:space-y-4">
          <a
            className={
              "p-4 text-center text-md font-semibold cursor-pointer bg-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:text-white  hover:text-gray-800 " +
              (currentFrame == 0
                ? " text-indigo-600 hover:text-indigo-600 border-b-2 border-indigo-600"
                : " text-gray-700 dark:text-gray-100")
            }
            onClick={() => setCurrentFrame(0)}
          >
            Account
          </a>
          <a
            className={
              "p-4 text-center text-md font-semibold cursor-pointer bg-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:text-white hover:text-gray-800 " +
              (currentFrame == 1
                ? "text-indigo-600 hover:text-indigo-600 border-b-2 border-indigo-600 "
                : "border-gray-700 text-gray-700 dark:text-gray-100")
            }
            onClick={() => setCurrentFrame(1)}
          >
            Appearance
          </a>
        </div>
        {currentFrame == 0 && <Account />}
        {currentFrame == 1 && <Appearence />}
      </div>
    </div>
  );
}
