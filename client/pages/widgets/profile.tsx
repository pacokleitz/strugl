import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarFull,
  faUsers, faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";
import Subject from "../../lib/subject";
import { useState } from "react";

// Données de tests (à supprimer plus tard)
const subject1 = new Subject(21, "Skincare", true);
const subject2 = new Subject(39, "DietGroup", true);

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
    <div className="px-4 py-4 flex flex-row space-x-8 justify-between">
      <div>
        <a href="/profile">
          <div className="w-min flex flex-row content-between items-center space-x-2">
            {props.subject.pic && <img src={props.subject.pic} />}
            {!props.subject.pic && (
              <img
                src="default.svg"
                className="w-10 rounded-full bg-white ring-2 ring-gray-300"
              />
            )}

            <h3 className="font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent hover:text-indigo-600">
              {props.subject.title}
            </h3>
          </div>
        </a>
      </div>
      <FontAwesomeIcon
        icon={currentStar}
        className="w-6 text-yellow-400 self-center hover:text-yellow-500 cursor-pointer"
        onClick={Star}
      />
    </div>
  );
}

export default function Profile() {
  const [favsList, setList] = useState(favs);

  return (
    <div className="shadow bg-white border-2 border-gray-100 border-opacity-60 rounded-lg divide-y">
      <a href="/profile" className="p-6 justify-center space-y-2">
        <img
          src="default.svg"
          className="w-20 rounded-full bg-white ring-2 ring-gray-300 self-center m-auto"
        />
        <p className="text-lg text-center font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent hover:text-indigo-600">
          sihamais
        </p>
        <p className="underline text-blue-600 text-center font-semibold hover:text-blue-700">
          Edit
        </p>
      </a>
      <div className="p-6 space-y-2 items-start">
        <a className="flex flex-row justify-between space-x-10 text-md font-semibold text-gray-600 hover:text-blue-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faUsers} className="w-6" />
            <p>Friends</p>
          </div>
          <p>28</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-md font-semibold text-gray-600 hover:text-yellow-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faStarFull} className="w-6" />
            <p>Interests</p>
          </div>
          <p>{favsList.length}</p>
        </a>
        <a className="flex flex-row justify-around space-x-10 text-md font-semibold text-gray-600 hover:text-red-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon
              icon={faBookmark}
              className="w-6 h-5 self-center"
            />
            <p>Bookmarks</p>
          </div>
          <p>31</p>
        </a>
      </div>
      <div className="divide-y">
        {favsList.map((subject) => (
          <SubjectRender key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
