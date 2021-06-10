import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faUsers,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import Subject from "../../lib/subject";
import { useState } from "react";

// Données de tests (à supprimer plus tard)
const subject1 = new Subject(21, "TestSubject 1", true);
const subject2 = new Subject(39, "TestSubject 2", true);

const favs: Subject[] = [subject1, subject2, subject1];
// Fin de données de tests (à supprimer plus tard)

function SubjectRender(props: any) {
  const [starState] = useState([faStarEmpty, faStarFull]);
  let [currentStarState, setCurrentStarState] = useState(1);
  let currentStar = starState[currentStarState];

  function Star() {
    if (currentStarState == 0) setCurrentStarState((currentStarState = 1));
    else setCurrentStarState((currentStarState = 0));
    currentStar = starState[currentStarState];
  }

  return (
    <div className="w-full px-4 py-4 flex flex-row space-x-16 justify-between">
      <div className="">
        <a href="/profile" className="group focus:outline-none">
          <div className="w-max flex flex-row content-between items-center space-x-2">
            {props.subject.pic && <img src={props.subject.pic} />}
            {!props.subject.pic && (
              <img
                src="default.svg"
                className="w-10 rounded-full bg-white ring-2 ring-gray-300"
              />
            )}

            <h3 className="font-semibold text-md text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
              {props.subject.title}
            </h3>
          </div>
        </a>
      </div>
      <FontAwesomeIcon
        icon={currentStar}
        className="w-5 text-gray-400 self-center hover:text-yellow-400 cursor-pointer"
        onClick={Star}
      />
    </div>
  );
}

export default function Profile() {
  const [favsList, setList] = useState(favs);

  return (
    <div className="w-full text-center flex flex-col">
      <div className="rounded-lg divide-y-2 divide-gray-300">
        <div className="flex flex-row p-6 justify-start items-center space-x-2 focus:outline-none">
          <img
            src="default.svg"
            className="w-10 rounded-full bg-white ring-2 ring-gray-300 self-center"
          />
          {typeof window !== "undefined" && (
            <p className="inline-block text-md text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
              {localStorage.getItem("username")}
            </p>
          )}
        </div>
        <div className="p-6 space-y-2 items-start">
          <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faUsers} className="w-5" />
              <p>Friends</p>
            </div>
            <p>28</p>
          </a>
          <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faStarFull} className="w-5" />
              <p>Interests</p>
            </div>
            <p>{favsList.length}</p>
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
        <div className="">
          {favsList.map((subject) => (
            <SubjectRender key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
