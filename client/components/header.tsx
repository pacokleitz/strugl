import {
  faEnvelope,
  faUser,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Header() {
  return (
    <div className="sticky top-0 w-full h-auto p-2 mb-10 shadow-sm flex flex-row content-center m-auto text-center justify-evenly align-baseline bg-white">
      <div className="w-2/3 flex flex-row content-center m-auto text-center justify-around items-end">
        <Link href="/dashboard" as="/">
          <h1 className="bg-gradient-to-br from-indigo-600 to-indigo-300 bg-clip-text text-transparent text-4xl font-bold tracking-tight cursor-pointer">
            Strugl
          </h1>
        </Link>
        <input
          placeholder="Search ..."
          className="w-1/3 px-3 py-1 m-auto rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <div className="flex flex-row content-center justify-around items-end space-x-10">
          <div className="relative inline-block">
            <FontAwesomeIcon
              icon={faUserFriends}
              className="w-8 h-8 text-gray-500 hover:text-gray-600 cursor-pointer"
              to="/profile"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs">
              2
            </span>
          </div>
          <div className="relative inline-block">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-8 h-8 text-gray-500 hover:text-gray-600 cursor-pointer"
              to="/profile"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs text-center">
              5
            </span>
          </div>
          <div className="relative inline-block">
            <FontAwesomeIcon
              icon={faUser}
              className="w-10 h-10 text-gray-500 hover:text-gray-600 cursor-pointer"
              to="/profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
