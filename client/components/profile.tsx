import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "../redux/hooks";

import Topic from "../lib/topic";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faUsers,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

function TopicRender(props: any) {
  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(1);
  let currentStar = starState[currentStarState];

  async function Unstar() {
    setCurrentStarState((currentStarState = 0));
    currentStar = starState[currentStarState];

    await fetch(`https://api.strugl.cc/unfollow/topic/`, {
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
        "w-full px-4 py-4 flex justify-between state"}
    >
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

export default function Profile(props: any) {
  const currentUser = useAppSelector((state) => state.currentUser);

  const [followingsList, setFollowingsList] = useState(props.followingsList);
  const [interestsList, setInterestsList] = useState(props.interestsList);

  function removeTopicFromList(idToRemove: number) {
    setTimeout(() => {
      setInterestsList(
        interestsList.filter((element: any) => element.topic_id != idToRemove)
      );
    }, 0);
  }

  return (
    <div className="w-full text-center flex flex-col h-screen">
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row p-6 justify-start items-center space-x-2 focus:outline-none">
          {!currentUser.avatar && (
            <img
              src="/default.svg"
              className="w-10 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          {currentUser.avatar && (
            <img
              src={currentUser.avatar}
              className="w-10 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          <p className="inline-block text-md text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
            {currentUser.username}
          </p>
        </div>
        <div className="p-6 space-y-2 items-start">
          <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faUsers} className="w-5" />
              <p>Followings</p>
            </div>
            <p>{followingsList ? followingsList.length : 0}</p>
          </a>
          <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faStarFull} className="w-5" />
              <p>Interests</p>
            </div>
            <p>{interestsList ? interestsList.length : 0}</p>
          </a>
          <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon
                icon={faBookmark}
                className="w-5 h-4 self-center"
              />
              <p>Bookmarks</p>
            </div>
            <p>31</p>
          </a>
        </div>
        <div className="h-full">
          {interestsList &&
            interestsList.map((topic: Topic) => (
              <TopicRender
                key={topic.topic_id}
                topic={topic}
                listFunction={removeTopicFromList}
              />
            ))}
          {!interestsList && (
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
