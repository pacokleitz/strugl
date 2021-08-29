import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateFeed } from "../redux/reducers/FeedSlice";

import { GetBookmarks, GetFollowings, GetInterests } from "../services/data";
import { UnfollowUser, UnfollowTopic } from "../services/actions";

import User from "../lib/user";
import Topic from "../lib/topic";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faPlusSquare as faPlusSquareFull,
  faBookmark,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPlusSquare as faPlusSquareEmpty,
  faStar as faStarEmpty,
} from "@fortawesome/free-regular-svg-icons";

import { useEffect } from "react";

function TopicRender(props: any) {
  const dispatch = useAppDispatch();

  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(1);
  let currentStar = starState[currentStarState];

  async function Unstar() {
    setCurrentStarState((currentStarState = 0));
    currentStar = starState[currentStarState];

    UnfollowTopic(dispatch, props.topic.topic_id);
  }

  return (
    <div className={"w-full px-4 py-4 flex justify-between state"}>
      <Link href={`/topic/${encodeURIComponent(props.topic.topic_name)}`}>
        <div className="group focus:outline-none w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
          <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
            {"#" + props.topic.topic_name}
          </h3>
        </div>
      </Link>
      <FontAwesomeIcon
        icon={currentStar}
        className="w-5 text-gray-400 self-center hover:text-yellow-400 cursor-pointer"
        onClick={Unstar}
      />
    </div>
  );
}

function UserRender(props: any) {
  const dispatch = useAppDispatch();

  const [addState] = useState([faPlusSquareEmpty, faPlusSquareFull]);
  let [currentaddState, setCurrentaddState] = useState(1);
  let currentAdd = addState[currentaddState];

  async function Unfollow() {
    setCurrentaddState((currentaddState = 0));
    currentAdd = addState[currentaddState];

    UnfollowUser(dispatch, props.friend);
  }

  return (
    <div className={"w-full px-4 py-4 flex justify-between state"}>
      <Link href={`/${encodeURIComponent(props.friend.username)}`}>
        <div className="group focus:outline-none w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
          {props.friend.avatar && (
            <img
              src={props.friend.avatar}
              className="w-9 rounded-full bg-gray-200 ring-2 ring-gray-200"
            />
          )}
          {!props.friend.avatar && (
            <div className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200" />
          )}

          <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
            {props.friend.username}
          </h3>
        </div>
      </Link>
      <FontAwesomeIcon
        icon={currentAdd}
        className="w-5 text-gray-400 self-center hover:text-indigo-500 cursor-pointer"
        onClick={Unfollow}
      />
    </div>
  );
}

export default function Profile() {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const interests = useAppSelector((state) => state.interests.list);
  const followings = useAppSelector((state) => state.followings.list);
  const bookmarks = useAppSelector((state) => state.bookmarks.list);

  let [currentStateList, setCurrentList] = useState(0);

  useEffect(() => {
    if (isLogged) {
      GetInterests(dispatch, currentUser.id);
      GetFollowings(dispatch, currentUser.id);
      GetBookmarks(dispatch);
    }
  }, []);

  return (
    <div className="w-full text-center flex flex-col h-screen">
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row p-6 justify-start items-center space-x-4 focus:outline-none">
          {!currentUser.avatar && (
            <div className="w-16 h-16 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center" />
          )}
          {currentUser.avatar && (
            <img
              src={currentUser.avatar}
              className="w-16 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center"
            />
          )}
          <p className="inline-block text-lg text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
            {currentUser.username}
          </p>
        </div>
        <div className="p-6 space-y-2 items-start">
          <a
            className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              dispatch(updateFeed(bookmarks));
            }}
          >
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon
                icon={faBookmark}
                className="w-5 h-4 self-center"
              />
              <p>Bookmarks</p>
            </div>
            <p>{bookmarks ? bookmarks.length : 0}</p>
          </a>
          <a
            className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              setCurrentList((currentStateList = 1));
            }}
          >
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faUsers} className="w-5" />
              <p>Followings</p>
            </div>
            <p>{followings ? followings.length : 0}</p>
          </a>
          <a
            className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              setCurrentList((currentStateList = 0));
            }}
          >
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faStarFull} className="w-5" />
              <p>Interests</p>
            </div>
            <p>{interests ? interests.length : 0}</p>
          </a>
        </div>
        <div className="h-full">
          {interests &&
            currentStateList == 0 &&
            interests.map((topic: Topic) => (
              <TopicRender key={topic.topic_id} topic={topic} />
            ))}
          {followings &&
            currentStateList == 1 &&
            followings.map((user: User) => (
              <UserRender key={user.id} friend={user} />
            ))}
        </div>
      </div>
    </div>
  );
}
