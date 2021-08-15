import { useState } from "react";
import Link from "next/link";
import { NextPageContext } from "next";

import Topic from "../lib/topic";
import User from "../lib/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faPlusSquare as faPlusSquareFull,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPlusSquare as faPlusSquareEmpty,
  faStar as faStarEmpty,
} from "@fortawesome/free-regular-svg-icons";

function TopicRender(props: any) {
  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(0);
  let currentStar = starState[currentStarState];

  async function Star() {
    if (currentStarState == 0) setCurrentStarState((currentStarState = 1));
    else setCurrentStarState((currentStarState = 0));
    currentStar = starState[currentStarState];
    await fetch(`https://api.strugl.cc/follow/topic/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ topic_id: props.topic.topic_id }),
    }).then(() => {
      props.listFunction(props.topic.topic_id);
    });
  }

  return (
    <div
      className={
        "p-4 flex flex-row space-x-8 justify-between state" +
        currentStarState.toString()
      }
    >
      <div>
        <Link href={`/topic/${encodeURIComponent(props.topic.topic_name)}`}>
          <div className="group focus:outline-none w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
            <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
              {"#" + props.topic.topic_name}
            </h3>
          </div>
        </Link>
      </div>
      <FontAwesomeIcon
        icon={currentStar}
        className="w-5 text-gray-400 self-center hover:text-yellow-400 cursor-pointer"
        onClick={Star}
      />
    </div>
  );
}

function FriendRender(props: any) {
  const [addState] = useState([faPlusSquareEmpty, faPlusSquareFull]);
  let [currentaddState, setCurrentaddState] = useState(0);
  let currentAdd = addState[currentaddState];

  async function Follow() {
    if (currentaddState == 0) setCurrentaddState((currentaddState = 1));
    else setCurrentaddState((currentaddState = 0));
    currentAdd = addState[currentaddState];

    await fetch(`https://api.strugl.cc/follow/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: props.friend.id }),
    }).then(() => {
      props.listFunction(props.friend.id);
    });
  }

  return (
    <div
      className={
        "w-full px-4 py-4 flex flex-row justify-between state" +
        currentaddState.toString()
      }
    >
      <div className="inline-block">
        <Link href="/${props.friend.username}" as={"/" + props.friend.username}>
          <div className="focus:outline-none group w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
            {props.friend.pic && <img src={props.friend.pic} />}
            {!props.friend.pic && (
              <img
                src="/default.svg"
                className="w-9 rounded-full bg-white ring-2 ring-gray-300"
              />
            )}

            <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased overflow-ellipsis">
              {props.friend.username}
            </h3>
          </div>
        </Link>
      </div>
      <FontAwesomeIcon
        icon={currentAdd}
        className="inline-block w-5 text-gray-400 self-center hover:text-indigo-500 cursor-pointer"
        onClick={Follow}
      />
    </div>
  );
}

export default function Suggestions(props: any) {
  const [topicsList, setTopicsList] = useState(props.topicsList);
  const [friendsList, setFriendsList] = useState(props.usersList);

  function removeFriendFromList(idToRemove: number) {
    setTimeout(() => {
      setFriendsList(
        friendsList.filter((element: any) => element.id != idToRemove)
      );
    }, 500);
  }

  function removeTopicFromList(idToRemove: number) {
    setTimeout(() => {
      setTopicsList(
        topicsList.filter((element: any) => element.id != idToRemove)
      );
    }, 500);
  }

  return (
    <div className="w-full text-center flex flex-col space-y-4 h-screen">
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row justify-between p-4">
          <h3 className="text-left text-sm font-semibold tracking-wide text-gray-700">
            You may know ...
          </h3>
          <button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faRedoAlt}
              className="w-4 text-gray-500 hover:text-gray-600 transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0"
            />
          </button>
        </div>
        <div>
          {friendsList &&
            friendsList.length > 0 &&
            friendsList.map((friend: User) => (
              <FriendRender
                key={friend.id}
                friend={friend}
                listFunction={removeFriendFromList}
              />
            ))}
          {friendsList && friendsList.length == 0 && (
            <p className="text-sm text-center font-semibold text-gray-600 subpixel-antialiased">
              Refresh for more suggestions
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row justify-between p-4">
          <h3 className="text-left text-sm font-semibold tracking-wide text-gray-700">
            You may like ...
          </h3>
          <button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faRedoAlt}
              className="w-4 text-gray-500 hover:text-gray-600 transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0"
            />
          </button>
        </div>
        <div>
          {topicsList &&
            topicsList.length > 0 &&
            topicsList.map((topic: Topic) => (
              <TopicRender
                key={topic.id}
                topic={topic}
                listFunction={removeTopicFromList}
              />
            ))}
          {topicsList && topicsList.length == 0 && (
            <p className="text-sm text-center font-semibold text-gray-600 subpixel-antialiased">
              Refresh for more suggestions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
