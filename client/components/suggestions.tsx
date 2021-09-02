import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { GetTopicsRecom, GetUsersRecom } from "../services/data";
import { FollowTopic, FollowUser } from "../services/actions";

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
  const dispatch = useAppDispatch();

  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(0);
  let currentStar = starState[currentStarState];

  async function Star() {
    setCurrentStarState((currentStarState = 1));
    currentStar = starState[currentStarState];

    FollowTopic(dispatch, props.topic);
  }

  return (
    <div
      className={
        "p-4 flex flex-row space-x-8 justify-between animate-fade" +
        props.topic.style
      }
    >
      <div>
        <Link
          href={`/topic/${encodeURIComponent(props.topic.topic_name)}`}
          as={"/topic/" + props.topic.topic_name}
        >
          <div className="group focus:outline-none w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
            <h3 className="text-gray-700 dark:text-gray-300 text-sm font-semibold group-hover:text-black dark:group-hover:text-gray-200 subpixel-antialiased">
              {"#" + props.topic.topic_name}
            </h3>
          </div>
        </Link>
      </div>
      <FontAwesomeIcon
        icon={currentStar}
        className="w-5 text-gray-400 dark:text-gray-300 self-center hover:text-yellow-400 dark:hover:text-yellow-400 cursor-pointer"
        onClick={Star}
      />
    </div>
  );
}

function FriendRender(props: any) {
  const dispatch = useAppDispatch();

  const [addState] = useState([faPlusSquareEmpty, faPlusSquareFull]);
  let [currentaddState, setCurrentaddState] = useState(0);
  let currentAdd = addState[currentaddState];

  async function Follow() {
    setCurrentaddState((currentaddState = 1));
    currentAdd = addState[currentaddState];

    FollowUser(dispatch, props.friend);
  }

  return (
    <div
      className={
        "w-full px-4 py-4 flex flex-row justify-between animate-fade" +
        props.friend.style
      }
    >
      <div className="inline-block">
        <Link href={`/${encodeURIComponent(props.friend.username)}`}>
          <div className="focus:outline-none group w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
            {props.friend.avatar && (
              <img
                src={props.friend.avatar}
                className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
              />
            )}
            {!props.friend.avatar && (
              <div className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200" />
            )}

            <div className="flex flex-row items-center space-x-1">
              <h3 className="text-gray-700 dark:text-gray-300 text-sm font-semibold group-hover:text-black dark:group-hover:text-gray-100 subpixel-antialiased overflow-ellipsis">
                {props.friend.profile_name}
              </h3>
              <p className="text-sm text-center font-medium italic text-gray-500 subpixel-antialiased">
                {"@" + props.friend.username}
              </p>
            </div>
          </div>
        </Link>
      </div>
      <FontAwesomeIcon
        icon={currentAdd}
        className="inline-block w-5 text-gray-400 dark:text-gray-300 self-center hover:text-indigo-500 dark:hover:text-indigo-500 cursor-pointer"
        onClick={Follow}
      />
    </div>
  );
}

export default function Suggestions() {
  const dispatch = useAppDispatch();

  const usersRecom = useAppSelector((state) => state.usersRecommandations.list);
  const topicsRecom = useAppSelector(
    (state) => state.topicsRecommandations.list
  );

  return (
    <div className="w-full text-center flex flex-col space-y-4 h-screen">
      <div className="rounded-lg divide-y-2 divide-gray-300 dark:divide-gray-850">
        <div className="flex flex-row justify-between p-4">
          <h3 className="text-left text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            You may know ...
          </h3>
          <button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faRedoAlt}
              className={
                "w-4 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0 " +
                (usersRecom.length == 0 ? "animate-spin" : "")
              }
              onClick={() => {
                GetUsersRecom(dispatch);
              }}
            />
          </button>
        </div>
        <div>
          {usersRecom &&
            usersRecom.length > 0 &&
            usersRecom.map((friend: User) => (
              <FriendRender key={friend.id} friend={friend} />
            ))}
          {usersRecom && usersRecom.length == 0 && (
            <p className="text-sm text-center font-semibold text-gray-400 subpixel-antialiased">
              Refresh for more suggestions
            </p>
          )}
        </div>
      </div>
      <div className="rounded-lg divide-y-2 divide-gray-300 dark:divide-gray-850">
        <div className="flex flex-row justify-between p-4">
          <h3 className="text-left text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
            You may like ...
          </h3>
          <button className="focus:outline-none">
            <FontAwesomeIcon
              icon={faRedoAlt}
              className={
                "w-4 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0 " +
                (topicsRecom.length == 0 ? "animate-spin" : "")
              }
              onClick={() => {
                GetTopicsRecom(dispatch);
              }}
            />
          </button>
        </div>
        <div>
          {topicsRecom &&
            topicsRecom.length > 0 &&
            topicsRecom.map((topic: Topic) => (
              <TopicRender key={topic.topic_id} topic={topic} />
            ))}
          {topicsRecom && topicsRecom.length == 0 && (
            <p className="text-sm text-center font-semibold text-gray-400 subpixel-antialiased">
              Refresh for more suggestions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
