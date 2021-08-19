import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { GetBookmarks, GetFollowings, GetInterests } from "../services/data";
import { UnfollowTopic } from "../services/actions";

import Topic from "../lib/topic";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faUsers,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import { updateFeed } from "../redux/reducers/FeedSlice";

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

export default function Profile() {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const interests = useAppSelector((state) => state.interests.list);
  const followings = useAppSelector((state) => state.followings.list);
  const bookmarks = useAppSelector((state) => state.bookmarks.list);

  useEffect(() => {
    GetInterests(dispatch, currentUser.id);
    GetFollowings(dispatch, currentUser.id);
    GetBookmarks(dispatch);
  }, []);

  return (
    <div className="w-full text-center flex flex-col h-screen">
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row p-6 justify-start items-center space-x-4 focus:outline-none">
          {!currentUser.avatar && (
            <img
              src="/default.svg"
              className="w-16 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          {currentUser.avatar && (
            <img
              src={currentUser.avatar}
              className="w-16 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          <p className="inline-block text-lg text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
            {currentUser.username}
          </p>
        </div>
        <div className="p-6 space-y-2 items-start">
          <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faUsers} className="w-5" />
              <p>Followings</p>
            </div>
            <p>{followings ? followings.length : 0}</p>
          </a>
          <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faStarFull} className="w-5" />
              <p>Interests</p>
            </div>
            <p>{interests ? interests.length : 0}</p>
          </a>
          <a
            className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              updateFeed(bookmarks);
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
        </div>
        <div className="h-full">
          {interests &&
            interests.map((topic: Topic) => (
              <TopicRender key={topic.topic_id} topic={topic} />
            ))}
          {!interests && (
            <div className="h-full flex flex-col space-y-4 justify-items-center justify-start py-6">
              <img src="duckbutticon.svg" className="h-1/6" />
              <p className="text-2xl font-semibold text-gray-600 subpixel-antialiased">
                No followings yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
