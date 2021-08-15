import { useState } from "react";
import Link from "next/link";
import { NextPageContext } from "next";

import Subject from "../lib/subject";
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

// Données de tests (à supprimer plus tard)
const person1 = new User(34, "testingwith20charact", "sihamais98@gmail.com");
const person2 = new User(1, "paco", "sihamais98@gmail.com");
const subject1 = new Subject(21, "React", false);
const subject2 = new Subject(39, "Next.js", false);

const FriendsSuggestions: User[] = [person1, person2];

const SubjectsSuggestions: Subject[] = [subject1, subject2];
// Fin de données de tests (à supprimer plus tard)

function SubjectRender(props: any) {
  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(0);
  let currentStar = starState[currentStarState];

  function Star() { 
    if (currentStarState == 0) setCurrentStarState((currentStarState = 1));
    else setCurrentStarState((currentStarState = 0));
    currentStar = starState[currentStarState];
    props.listFunction(props.subject.id);
  }

  return (
    <div
      className={
        "p-4 flex flex-row space-x-8 justify-between state" +
        currentStarState.toString()
      }
    >
      <div>
        <Link href="/${props.subject.title}" as={"/" + props.subject.title}>
          <div className="group focus:outline-none w-max flex flex-row content-between items-center space-x-2 cursor-pointer">
            {props.subject.pic && <img src={props.subject.pic} />}
            {!props.subject.pic && (
              <img
                src="/default.svg"
                className="w-9 rounded-full bg-white ring-2 ring-gray-300"
              />
            )}

            <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
              {props.subject.title}
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

    await fetch(`https://api.strugl.cc/follow/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.friend.id }),
    }).then(() => {
      props.listFunction(props.friend.id);
    });
  }

  return (
    <div
      className={
        "w-full px-4 py-4 flex flex-row justify-between space-x-4 state" +
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

            <h3 className="text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
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

export default function Suggestions() {
  const [subjectsList, setSubjectsList] = useState(SubjectsSuggestions);
  const [friendsList, setFriendsList] = useState(FriendsSuggestions);

  function removeFriendFromList(idToRemove: number) {
    setTimeout(() => {
      setFriendsList(friendsList.filter((element) => element.id != idToRemove));
    }, 500);
  }

  function removeTopicFromList(idToRemove: number) {
    setTimeout(() => {
      setSubjectsList(
        subjectsList.filter((element) => element.id != idToRemove)
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
          {friendsList.map((friend: User) => (
            <FriendRender
              key={friend.id}
              friend={friend}
              listFunction={removeFriendFromList}
            />
          ))}
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
          {subjectsList.map((subject: Subject) => (
            <SubjectRender
              key={subject.id}
              subject={subject}
              listFunction={removeTopicFromList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Suggestions.getInitialProps = async (ctx: NextPageContext) => {};
