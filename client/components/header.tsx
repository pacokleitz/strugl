import { Fragment, useCallback } from "react";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  faSortDown,
  faCompass,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Search, SignOut } from "../services/actions";
import { GetFeed } from "../services/data";
import { FormInputs } from "./feed";
import { SubmitHandler, useForm } from "react-hook-form";
import { updateSearch } from "../redux/reducers/SearchSlice";

function Account() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const dispatch = useAppDispatch();

  async function Navigate(to: String) {
    if (to == "SignOut") SignOut(dispatch, router);
    else if (to == "Settings") router.push("/settings", "/");
    else router.push(`/${encodeURIComponent(currentUser.username)}`);
  }

  return (
    <Menu
      as="div"
      className="relative self-center items-center inline-block text-center"
    >
      {({ open }) => (
        <>
          <Menu.Button className="focus:outline-none space-x-2">
            <div className="inline-block items-center space-x-2">
              {currentUser.avatar && (
                <img
                  src={currentUser.avatar}
                  className="inline-block w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
                />
              )}
              {!currentUser.username && (
                <div className="inline-block w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain" />
              )}
            </div>
            <div className="hidden lg:inline-block">
              <FontAwesomeIcon
                icon={faSortDown}
                className="inline mb-2 w-5 h-7 text-gray-700 dark:text-gray-400"
              />
            </div>
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute -right-2 mt-4 w-max rounded-md shadow-lg bg-white dark:bg-gray-850 ring-1 ring-gray-950 ring-opacity-10 focus:outline-none"
            >
              <div className="select-none">
                <Menu.Item>
                  <div className="px-8 py-2 cursor-default select-none">
                    <p className="inline-block text-gray-700 dark:text-gray-300 text-sm font-medium tracking-wide">
                      Signed in as
                    </p>{" "}
                    <p className="inline-block text-sm font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 bg-clip-text text-transparent tracking-wide">
                      {currentUser.username}
                    </p>
                  </div>
                </Menu.Item>
                <hr className="dark:border-gray-950"></hr>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("Profile")}
                    className="text-gray-700 dark:text-gray-300 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer"
                  >
                    Profile
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("Settings")}
                    className="text-gray-700 dark:text-gray-300 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer"
                  >
                    Settings
                  </a>
                </Menu.Item>
                <hr className="dark:border-gray-950"></hr>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("SignOut")}
                    className="text-gray-700 dark:text-gray-300 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer"
                  >
                    Sign out
                  </a>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

function SearchResult(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  function Navigate() {
    dispatch(updateSearch([]));
    props.result.type == "user"
      ? router.push(`/${encodeURIComponent(props.result.name)}`)
      : router.push(`/topic/${encodeURIComponent(props.result.name)}`);
    props.resetFunction({ content: "" });
  }
  return (
    <a
      onClick={Navigate}
      className={
        "w-full flex flex-row justify-start items-center space-x-4 text-gray-700 dark:text-gray-200 text-sm font-medium tracking-wide hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer " +
        (props.result.type == "user" ? "px-4 py-2" : "p-4")
      }
    >
      {props.result.type == "user" && (
        <img
          src={props.result.avatar}
          className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
        ></img>
      )}
      <div className="text-gray-700 dark:text-gray-200 text-sm font-semibold group-hover:text-black subpixel-antialiased overflow-ellipsis">
        {props.result.type == "topic"
          ? "#" + props.result.name
          : props.result.name}
      </div>
    </a>
  );
}

function SearchList() {
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.search.list);

  const { register, getValues, reset } = useForm<FormInputs>({
    mode: "onChange",
  });

  const onChange = useCallback(async () => {
    let content = getValues("content");
    if (content.length > 0) {
      Search(dispatch, content);
    } else dispatch(updateSearch([]));
  }, []);

  return (
    <div className="lg:w-1/4 w-1/2 relative self-center items-center inline-block text-center">
      {" "}
      <form
        className="focus-within:shadow-inner flex flex-row px-4 py-1 items-center justify-between rounded-3xl bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 focus:outline-none "
        onChange={onChange}
        autoComplete="off"
        onSubmit={() => event?.preventDefault()}
      >
        <input
          {...register("content")}
          placeholder="Search"
          type="search"
          className="text-md subpixel-antialiased dark:text-gray-300 text-justify px-2 bg-transparent focus:outline-none w-full"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className=" w-5 h-5 text-gray-700 dark:text-gray-400 cursor-pointer transition duration-500 ease-in-out transform-gpu hover:rotate-45 rotate-0"
          type="submit"
        />
      </form>
      {list.length > 0 && (
        <div className="origin-top absolute mt-4 w-full rounded-md shadow-lg bg-white dark:bg-gray-850 ring-1 ring-gray-950 ring-opacity-10 focus:outline-none divide-y divide-gray-300 dark:divide-gray-950">
          {list.map((result) => (
            <SearchResult
              result={result}
              key={result.id + result.type}
              resetFunction={reset}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);

  async function Navigate(to: String) {
    if (to == "Dashboard") {
      GetFeed(dispatch);
      router.push("/dashboard", "/");
    } else if (to == "Explore") router.push("/explore", "/");
  }

  return (
    <div className="fixed top-2 right-4 left-4 nabvar h-min p-2 shadow flex flex-row rounded-xl text-center align-baseline justify-between bg-white dark:bg-gray-850 z-50">
      <div className="w-full px-1 lg:px-6 flex flex-row m-auto text-center justify-between">
        <a
          onClick={() => {
            Navigate("Dashboard");
          }}
          className="lg:block hidden text-indigo-500 dark:text-indigo-700 text-4xl font-bold tracking-tight cursor-pointer"
        >
          Strugl
        </a>
        <SearchList />
        {isLogged && (
          <>
            <div className="flex flex-row lg:w-1/6 w-1/3 justify-evenly items-center">
              <a onClick={() => Navigate("Dashboard")} title="Home">
                <div className="self-center space-y-1 cursor-pointer group">
                  <div className="w-9 h-2 bg-gray-600 dark:bg-gray-300 bg-opacity-80 dark:bg-opacity-70 rounded-md transition duration-500 ease-in-out transform-gpu translate-x-0 group-hover:translate-x-1"></div>
                  <div className="w-9 h-2 bg-gray-600 dark:bg-gray-300 transition duration-500 ease-in-out rounded-md transform-gpu translate-x-0 group-hover:-translate-x-1"></div>
                  <div className="w-9 h-2 bg-gray-600 dark:bg-gray-300 bg-opacity-90 dark:bg-opacity-80 rounded-md transition duration-500 ease-in-out transform-gpu translate-x-0 group-hover:translate-x-1"></div>
                </div>
              </a>
              <div className="self-center">
                <a onClick={() => Navigate("Explore")} title="Explore">
                  <FontAwesomeIcon
                    icon={faCompass}
                    className="w-9 h-9 text-gray-600 dark:text-gray-400 cursor-pointer transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0"
                  />
                </a>
              </div>
            </div>
            <Account />
          </>
        )}
        {!isLogged && (
          <div className="">
            <Link href="/login" as="/">
              <div className="px-4 self-center py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700">
                Log In
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
