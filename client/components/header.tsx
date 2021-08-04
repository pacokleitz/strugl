import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { current } from "@reduxjs/toolkit";
import { logOut } from "../redux/reducers/CurrentUserSlice";


import Message from "../lib/message";
import User from "../lib/user";

import {
  faChevronCircleDown,
  faSortDown,
  faEnvelope,
  faUser,
  faUserFriends,
  faCompass,
  faSearch,
  faCheck,
  faTimes,
  faHome,
  faComments,
  faStream,
} from "@fortawesome/free-solid-svg-icons";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";

// Données de tests (à supprimer plus tard)
let testDate = new Date(2021, 3, 25, 17, 43);
testDate.toDateString();
const siham = new User(34, "testingwith20charact", "sihamais98@gmail.com");
const paco = new User(32, "testUser1", "sihamais98@gmail.com");
const msg1 = new Message(12, siham, "Short comment test !", testDate);
const msg2 = new Message(
  15,
  paco,
  "Long comment test ! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto ut dolores et quo eos voluptatibus doloremque repudiandae nesciunt veniam, exercitationem quod quas, vel labore cumque recusandae libero autem iure inventore?",
  testDate
);

const initialInboxList: Message[] = [msg1, msg2];
const initialInvitesList: User[] = [siham, paco];
// Fin de données de tests (à supprimer plus tard)

function Account() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();

  function Navigate(to: String) {
    if (!currentUser.username || to == "SignOut") {
      dispatch(logOut());
      router.push("/");
    } else {
      if (to == "Settings") router.push("/settings", "/");
      else if (to == "Profile")
        router.push("/${currentUser.username}", "/" + currentUser.username);
    }
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
              <img
                src="default.svg"
                className="inline-block w-9 rounded-full bg-white ring-2 ring-gray-300"
              />
              <p className="inline-block text-md text-center font-semibold text-gray-700 group-hover:text-gray-700 subpixel-antialiased">
                {currentUser.username}
              </p>
            </div>
            <div className="inline-block">
              <FontAwesomeIcon
                icon={faSortDown}
                className="inline mb-2 w-5 h-7 text-gray-700"
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
              className="origin-top-right absolute -right-2 mt-3 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="select-none">
                <Menu.Item>
                  <div className="px-8 py-2 cursor-default select-none">
                    <p className="inline-block text-gray-700 text-sm font-medium tracking-wide">
                      Signed in as
                    </p>{" "}
                    <p className="inline-block text-sm font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                      {currentUser.username}
                    </p>
                  </div>
                </Menu.Item>
                <hr></hr>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("Profile")}
                    className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 cursor-pointer"
                  >
                    Profile
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("Settings")}
                    className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 cursor-pointer"
                  >
                    Settings
                  </a>
                </Menu.Item>
                <hr></hr>
                <Menu.Item>
                  <a
                    onClick={() => Navigate("SignOut")}
                    className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 cursor-pointer"
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

function Inbox() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [inboxList, setList] = useState(initialInboxList);

  function Navigate(to: String) {
    if (!currentUser.username) {
      dispatch(logOut());
      router.push("/");
    } else {
      if (to == "Inbox") router.push("/inbox", "/");
    }
  }

  function MessageRender(props: any) {
    let message =
      props.message.content.length < 20
        ? props.message.content
        : props.message.content.slice(0, 17) + "...";
    return (
      <>
        <Menu.Item>
          <div className="rounded-md px-4 py-2 space-y-2 bg-white w-auto hover:bg-gray-50 cursor-pointer ">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-row space-x-2 items-start ">
                <Link
                  href="/${props.message.author.username}"
                  as={"/" + props.message.author.username}
                >
                  <a className="focus:outline-none group p-1">
                    {props.message.author.pic && (
                      <img src={props.comment.author.pic} />
                    )}
                    {!props.message.author.pic && (
                      <img
                        src="default.svg"
                        className="w-9 rounded-full bg-white ring-2 ring-gray-300"
                      />
                    )}
                  </a>
                </Link>
                <div className="text-justify text-gray-700 text-sm font-medium tracking-wide rounded-3xl self-center bg-gray-100 border border-gray-200 p-2 px-4 overflow-hidden">
                  <Link
                    href="/${props.message.author.username}"
                    as={"/" + props.message.author.username}
                  >
                    <a className="focus:outline-none float-left mr-2 w-auto text-gray-800 text-sm font-semibold tracking-wide hover:text-gray-900 subpixel-antialiased">
                      {props.message.author.username}
                    </a>
                  </Link>
                  {message}
                </div>
              </div>
              <p className="text-left ml-4 self-center text-xs font-medium text-gray-500 tracking-tighter">
                {weekday[props.message.date.getDay()]}
                {"."}
              </p>
            </div>
          </div>
        </Menu.Item>
        <hr></hr>
      </>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-center self-end">
      {({ open }) => (
        <>
          <Menu.Button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faComments}
              className="w-8 h-6 text-gray-700 hover:text-gray-600 cursor-pointer"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs text-center">
              5
            </span>
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
              className="origin-top-right absolute -right-3 mt-3 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="select-none">
                {inboxList.map((message) => (
                  <MessageRender key={message.id} message={message} />
                ))}
                <Menu.Item>
                  <a
                    onClick={() => Navigate("Inbox")}
                    className="text-indigo-600 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50 cursor-pointer"
                  >
                    See all
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

function Invites() {
  const [invitesList, setList] = useState(initialInvitesList);

  function InviteRender(props: any) {
    return (
      <Menu.Item>
        <div className="w-full px-4 py-3 flex flex-row justify-between space-x-6">
          <div className="inline-block">
            <Link
              href="/${props.friend.username}"
              as={"/" + props.friend.username}
            >
              <a href="/profile" className="focus:outline-none group">
                <div className="w-max flex flex-row content-between items-center space-x-2">
                  {props.friend.pic && <img src={props.friend.pic} />}
                  {!props.friend.pic && (
                    <img
                      src="default.svg"
                      className="w-9 rounded-full bg-white ring-2 ring-gray-300"
                    />
                  )}

                  <h3 className="text-gray-700 text-sm font-semibold   tracking-wide group-hover:text-gray-900 subpixel-antialiased">
                    {props.friend.username}
                  </h3>
                </div>
              </a>
            </Link>
          </div>
          <div className="justify-between space-x-2 m-auto align-middle">
            <FontAwesomeIcon
              icon={faCheck}
              className="inline-block w-4 text-gray-400 self-center hover:text-green-400 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faTimes}
              className="inline-block w-3 text-gray-400 self-center hover:text-red-400 cursor-pointer"
            />
          </div>
        </div>
      </Menu.Item>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-center self-end">
      {({ open }) => (
        <>
          <Menu.Button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faUserFriends}
              className="w-8 h-6 text-gray-700 hover:text-gray-600 cursor-pointer"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs">
              2
            </span>
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
              className="origin-top-right absolute -right-3 mt-3 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="select-none divide-y divide-gray-200">
                {invitesList.map((friend) => (
                  <InviteRender key={friend.id} friend={friend} />
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default function Header() {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();

  function Navigate(to: String) {
    if (!currentUser.username) {
      dispatch(logOut());
      router.push("/");
    } else {
      if (to == "Dashboard") router.push("/dashboard", "/");
      else if (to == "Explore") router.push("/explore", "/");
    }
  }

  return (
    <div className="fixed top-0 w-full h-min p-2 mb-4 shadow-md flex flex-row m-auto text-center align-baseline justify-between bg-white z-50">
      <div className="w-10/12 flex flex-row m-auto text-center justify-between">
        <a
          onClick={() => Navigate("Dashboard")}
          className="text-indigo-500 text-4xl font-bold tracking-tight cursor-pointer"
        >
          Strugl
        </a>
        <div className="focus-within:shadow-inner flex flex-row px-4 py-1 items-center justify-between w-1/4 rounded-3xl bg-gray-100 border border-gray-200 focus:outline-none ">
          <input
            placeholder="Search"
            className="text-md subpixel-antialiased text-justify px-2 bg-transparent focus:outline-none w-full"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className=" w-5 h-5 text-gray-700 cursor-pointer transform-gpu hover:rotate-45 rotate-0"
          />
        </div>
        <div className="flex flex-row justify-evenly items-end space-x-10">
          <div className="inline-block self-center">
            <a onClick={() => Navigate("Dashboard")}>
              <FontAwesomeIcon
                icon={faStream}
                className="w-8 h-8 text-gray-700 cursor-pointer transition duration-500 ease-in-out transform-gpu hover:skew-y-6"
                title="Home"
              />
            </a>
          </div>
          <div className="inline-block self-center">
            <a onClick={() => Navigate("Explore")}>
              <FontAwesomeIcon
                icon={faCompass}
                className="w-8 h-8 text-gray-700 cursor-pointer transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0"
                title="Explore"
              />
            </a>
          </div>
        </div>
        <div className="focus:outline-none flex flex-row justify-between space-x-8 my-auto">
          <Inbox />
          <Invites />
          <Account />
        </div>
      </div>
    </div>
  );
}
