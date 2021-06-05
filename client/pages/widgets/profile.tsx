import { faStar as fasStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Subject from "../../lib/subject";

const subject1 = new Subject(21, "Skincare");
const subject2 = new Subject(39, "DietGroup");

const favs: Subject[] = [subject1, subject2, subject1];

function SubjectRender(props: any) {
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

              <h3 className="font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                {props.subject.title}
              </h3>
            </div>
          </a>
        </div>
        <FontAwesomeIcon icon={fasStar} className="w-6 text-yellow-400 self-center"/>
      </div>
    );

}

export default function Profile() {
  return (
    <div className="flex flex-col shadow bg-white border-2 border-gray-100 border-opacity-60 rounded-lg divide-y">
      <a href="/profile" className="p-6 justify-center space-y-2">
        <img
          src="default.svg"
          className="w-20 rounded-full bg-white ring-2 ring-gray-300 self-center m-auto"
        />
        <p className="text-lg text-center font-semibold text-gray-600">
          sihamais
        </p>
        <p className="underline text-blue-600 text-center font-semibold hover:text-blue-700">
          Edit
        </p>
      </a>
      <div className="p-6 space-y-2">
        <a className="flex flex-row justify-between space-x-10 text-md text-center font-semibold text-gray-600">
          <FontAwesomeIcon icon={faUsers} className="w-6" />
          <p>Friends</p>
          <p>28</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-md text-center font-semibold text-gray-600">
          <FontAwesomeIcon icon={farStar} className="w-6" />
          <p>Interests</p>
          <p>16</p>
        </a>
      </div>
      <div className="divide-y">
        {favs.map((subject) => (
          <SubjectRender key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
