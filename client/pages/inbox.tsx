import React, { useEffect, useState } from "react";
import { AppContext } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Feed from "../components/feed";
import Header from "../components/header";
import Message from "../lib/message";
import User from "../lib/user";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { auth } from "../redux/reducers/CurrentUserSlice";

let msg1 = new Message(
  56,
  new User(22, "testing", "testing@test.test"),
  "short message test",
  new Date()
);
let msg2 = new Message(
  46,
  new User(25, "testing2", "testing@test.test"),
  "long message test ! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium, necessitatibus ab laudantium assumenda vel dolores? Labore provident, facere iure odio voluptatum, minima cum nihil delectus totam distinctio quo dignissimos laudantium.",
  new Date()
);

let user1 = new User(25, "testing2", "testing@test.test");
let user2 = new User(26, "testing1", "testing@test.test");
let user3 = new User(27, "testing3", "testing@test.test");
let user4 = new User(28, "testing4", "testing@test.test");
let user5 = new User(29, "testing6", "testing@test.test");
let user6 = new User(20, "testing7", "testing@test.test");
let user7 = new User(21, "testing8", "testing@test.test");
let user8 = new User(22, "testing5", "testing@test.test");

let initialList = [msg1, msg2];

function MessageDisplay() {
  return <div className="col-span-2"></div>;
}

function UserRender(props: any) {
  let message =
    props.message.content.length < 26
      ? props.message.content
      : props.message.content.slice(0, 23) + " ...";

  const router = useRouter();

  let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-md">
      <div className="px-4 py-4 space-y-2 bg-white w-auto hover:bg-gray-50 cursor-pointer ">
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row space-x-0 items-center ">
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
            <div className="text-justify flex flex-col text-gray-700 text-sm font-medium tracking-wide rounded-3xl self-center p-2 px-4 overflow-hidden">
              <Link
                href="/${props.message.author.username}"
                as={"/" + props.message.author.username}
              >
                <a className="focus:outline-none w-auto text-gray-800 text-md font-semibold tracking-wide hover:text-gray-900 subpixel-antialiased">
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
      <hr></hr>
    </div>
  );
}

function InboxRender() {
  let [messagesList, setMessagesList] = useState(initialList);
  return (
    <div className="col-span-3 w-full h-full md:grid md:grid-cols-3 space-x-4 pb-4">
      <div className="col-span-1 shadow bg-white border-2 border-gray-100 border-opacity-60 rounded-xl overflow-y-scroll">
        <div className="px-4 py-2 justify-center">
          <div className="focus-within:shadow-inner flex flex-row px-4 py-1 items-center justify-between w-full rounded-3xl bg-gray-100 border border-gray-200 focus:outline-none">
            <input
              placeholder="Find or start a conversation"
              className="text-md subpixel-antialiased text-justify px-2 bg-transparent focus:outline-none w-full"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className=" w-5 h-5 text-gray-700 cursor-pointer transform-gpu hover:rotate-45 rotate-0"
            />
          </div>
        </div>
        <hr></hr>
        {messagesList.map((message) => (
          <UserRender key={message.id} message={message} />
        ))}
      </div>{" "}
      <div className="col-span-2 h-full w-full rounded-xl hidden md:flex flex-col text-center justify-items-center justify-center">
        <p className="text-2xl font-semibold text-gray-500 subpixel-antialiased">
          Select a discussion to chat
        </p>
      </div>
    </div>
  );
}

export default function Inbox({ postsList }: any) {
  return (
    <div className="min-h-screen h-full w-full bg-gray-100">
      <Head>
        <title>Strugl - Inbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="pt-16 px-4 h-full w-full lg:grid lg:grid-cols-5 gap-12">
        <InboxRender />
        <div className="lg:block lg:col-span-2 hidden">
          <Feed feedType="dashboardFeed" postsList={postsList} />
        </div>
      </div>
    </div>
  );
}

Inbox.getInitialProps = async (ctx: AppContext) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Check token
  await fetch("https://api.strugl.cc/api/users/me", {
    method: "Get",
    credentials: "include",
  }).then(async (res) => {
    const text = await res.text();
    if (res.ok) {
      dispatch(auth(new User(0, text, "")));
    } else router.push("/");
  });

  // feed fetch
  const res = await fetch(`https://api.strugl.cc/posts/user/paco`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  return { postsList: json };
};
