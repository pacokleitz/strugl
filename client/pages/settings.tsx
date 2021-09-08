import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { GetCurrentUser } from "../services/data";

import Header from "../components/header";
import { updateSearch } from "../redux/reducers/SearchSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateAvatar, UpdateProfile } from "../services/actions";
import Alert from "../components/alert";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export interface FormInputs {
  profile_name: string;
  bio: string;
}

interface AvatarInput {
  avatar: FileList;
}

function Account() {
  const dispatch = useAppDispatch();

  const { register: registerForm, handleSubmit: submitForm } =
    useForm<FormInputs>({ mode: "onChange" });

  const { register: registerAvatar, handleSubmit: submitAvatar } =
    useForm<AvatarInput>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    UpdateProfile(dispatch, data);
  }, []);

  const onChange: SubmitHandler<AvatarInput> = useCallback(async (data) => {
    var formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    UpdateAvatar(dispatch, formData);
  }, []);

  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  return (
    <div className="h-full col-span-3 md:p-8 p-2 w-full space-y-2 flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-850">
      <h1 className="text-3xl text-gray-700 font-medium dark:text-gray-100">
        Profile
      </h1>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
          Edit your profile informations here. Push the button to save the
          changes.
        </p>
        <div className="flex md:flex-row flex-col-reverse md:py-10 py-4 justify-evenly md:items-start md:space-x-8 md:gap-0 gap-8 focus:outline-none items-center">
          <form
            className="flex flex-col content-between gap-8 focus:outline-none max-w-sm w-full"
            onSubmit={submitForm(onSubmit)}
          >
            <div className="flex flex-col focus:outline-none space-x-1 space-y-1">
              <label className="text-gray-600 dark:text-gray-200 font-semibold text-sm focus:outline-none">
                Username
              </label>
              <input
                value={currentUser.username}
                type="text"
                autoComplete="off"
                className="w-full p-2 px-4 rounded-md bg-gray-200 dark:bg-gray-850 dark:bg-opacity-60 border border-gray-200 dark:border-black dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
                disabled
              ></input>
            </div>

            <div className="flex flex-col space-x-1 space-y-1">
              <label className="text-gray-600 dark:text-gray-200 font-semibold text-sm">
                Profile name
              </label>
              <input
                defaultValue={currentUser.profile_name}
                type="text"
                autoComplete="off"
                className="w-full p-2 px-4 rounded-md bg-white dark:bg-gray-850 border border-gray-200 dark:border-black dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
                {...registerForm("profile_name", {
                  maxLength: {
                    value: 30,
                    message: "Profile name exceeds max length.",
                  },
                })}
                maxLength={30}
              ></input>
            </div>

            <div className="flex flex-col space-x-1 space-y-1">
              <label className="text-gray-600 dark:text-gray-200 font-semibold text-sm">
                Bio
              </label>
              <textarea
                defaultValue={currentUser.bio}
                placeholder="Tell us a little bit about yourself"
                autoComplete="off"
                className="w-full p-2 px-4 rounded-md bg-white dark:bg-gray-850 border border-gray-200 dark:border-black dark:text-gray-100 focus:shadow-inner focus:outline-none text-md font-medium text-justify subpixel-antialiased"
                {...registerForm("bio", {
                  maxLength: {
                    value: 200,
                    message: "Bio exceeds max length.",
                  },
                })}
                maxLength={200}
              ></textarea>
            </div>
            <input
              type="submit"
              value="Update profile"
              className="px-4 py-2 text-center w-min self-start mt-8 text-md font-semibold cursor-pointer rounded-md bg-gray-100 dark:bg-gray-950 border-2 border-gray-600 dark:border-gray-300 text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 dark:hover:border-indigo-400"
            />
          </form>

          <form
            encType="multipart/form-data"
            onChange={submitAvatar(onChange)}
            className="relative"
          >
            <label
              htmlFor="avatarEdit"
              className="cursor-pointer group space-y-1"
            >
              <p className="text-gray-600 dark:text-gray-200 font-semibold text-sm">
                Profile picture
              </p>
              {!currentUser.avatar && (
                <div className="min-w-52 rounded-full bg-gray-200 ring-2 ring-gray-200self-center" />
              )}
              {currentUser.avatar && (
                <img
                  src={currentUser.avatar}
                  className="w-52 h-52 rounded-full self-start bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-black object-contain"
                />
              )}
              <div className="w-max gap-1 p-1 px-2 top-44 absolute bg-white dark:bg-gray-850 border-2 border-gray-200 dark:border dark:border-black rounded-md text-gray-700 dark:text-gray-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <p className="text-sm">Edit</p>
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              id="avatarEdit"
              className="hidden"
              {...registerAvatar("avatar")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

function Appearence() {
  const [currentTheme, setCurrentTheme] = useState(
    document.documentElement.classList.contains("dark") ? 1 : 0
  );

  return (
    <div className="h-full col-span-3 md:p-8 p-2 space-y-2 flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-850">
      <h1 className="text-3xl text-gray-700 dark:text-gray-100 font-medium">
        Theme
      </h1>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
          Choose your favorite theme for this session.
        </p>
        <div className="flex md:flex-row flex-col justify-evenly gap-8 py-8">
          <div
            id="light"
            className={
              "md:w-full max-w-sm h-full ring-2 rounded-xl shadow-md divide-y-2 divide-gray-200 dark:divide-gray-850 cursor-pointer " +
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
            <div className="w-full px-4 py-2 text-center dark:text-gray-100 text-md font-medium ">
              Light mode
            </div>
          </div>

          <div
            id="dark"
            className={
              "md:w-full max-w-sm h-full ring-2 rounded-xl divide-y-2 divide-gray-200 dark:divide-gray-850 shadow-md cursor-pointer " +
              (currentTheme == 1 ? "ring-indigo-500" : "ring-gray-600")
            }
            onClick={() => {
              setCurrentTheme(1);
              document.documentElement.classList.add("dark");
              localStorage.theme = "dark";
            }}
          >
            <div className="bg-gray-950 w-full p-1 rounded-t-xl">
              <div className="bg-gray-850 w-full rounded-xl h-6 flex flex-row gap-1">
                <div className="h-2 rounded-xl bg-indigo-500 w-1/5 self-center m-auto"></div>
                <div className="h-2 rounded-xl bg-gray-500 w-1/5 self-center m-auto"></div>
                <div className="h-2 rounded-xl bg-gray-600 w-1/5 self-center m-auto"></div>
              </div>
              <div className="py-2 flex flex-row justify-evenly">
                <div className="h-16 bg-gray-600 w-1/4 rounded"></div>
                <div className="h-36 bg-gray-850 w-1/3 rounded-lg p-2 space-y-1">
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
            <div className="w-full px-4 py-2 text-center dark:text-gray-100 text-md font-medium ">
              Dark mode
            </div>
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
  const alert = useAppSelector((state) => state.alerts.list[0]);

  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    GetCurrentUser(dispatch);
    if (!isLogged) router.push("/login", "/");
  });

  return (
    <div
      className="min-h-screen h-full w-screen max-w-full bg-gray-100 dark:bg-gray-950"
      onClick={() => dispatch(updateSearch([]))}
    >
      <Head>
        <title>Strugl - Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="min-h-screen pt-20 max-w-5xl w-screen px-4 m-auto justify-center pb-4 grid md:grid-cols-4 grid-cols-1 gap-4 md:divide-x-2 divide-gray-200 dark:divide-gray-850">
        <div className="col-span-1 h-full grid md:grid-flow-row grid-flow-col content-start md:pt-20 justify-evenly md:space-y-4">
          <a
            className={
              "p-4 text-center text-md font-semibold cursor-pointer bg-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:hover:text-white  hover:text-gray-850 " +
              (currentFrame == 0
                ? " text-indigo-600 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-500 border-b-2 border-indigo-600 dark:border-indigo-500"
                : " text-gray-700 dark:text-gray-100")
            }
            onClick={() => setCurrentFrame(0)}
          >
            Account
          </a>
          <a
            className={
              "p-4 text-center text-md font-semibold cursor-pointer bg-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:hover:text-white hover:text-gray-850 " +
              (currentFrame == 1
                ? "text-indigo-600 hover:text-indigo-600 border-b-2 border-indigo-600 dark:border-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-500 "
                : "border-gray-700 text-gray-700 dark:text-gray-100")
            }
            onClick={() => setCurrentFrame(1)}
          >
            Appearance
          </a>
          {alert && <Alert alert={alert} />}
        </div>
        <>
          {currentFrame == 0 && <Account />}
          {currentFrame == 1 && <Appearence />}
        </>
      </div>
    </div>
  );
}
