import {
  faChevronCircleDown,
  faSortDown,
  faEnvelope,
  faUser,
  faUserFriends,
  faCompass,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export default function Header() {
  const router = useRouter();

  function SignOut() {
    localStorage.clear();
    router.push("/");
  }

  return (
    <div className="sticky top-0 w-full h-auto p-2 mb-4 shadow-md flex flex-row m-auto text-center align-baseline justify-between bg-white">
      <div className="w-10/12 flex flex-row m-auto text-center justify-between">
        <Link href="/dashboard" as="/">
          <h1 className="bg-gradient-to-br from-indigo-600 to-indigo-300 bg-clip-text text-transparent text-4xl font-bold tracking-tight cursor-pointer">
            Strugl
          </h1>
        </Link>
        <div className="focus-within:shadow-inner flex flex-row px-4 py-1 items-center justify-between w-1/3 rounded-3xl bg-gray-100 border border-gray-200 focus:outline-none ">
          <input
            placeholder="Search ..."
            className="text-md subpixel-antialiased text-justify px-2 bg-transparent focus:outline-none w-full"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className=" w-5 h-5 text-gray-700 cursor-pointer transform-gpu hover:rotate-45 rotate-0"
          />
        </div>
        <div className="flex flex-row content-center justify-between items-end space-x-8">
          <div className="self-center relative inline-block">
            <FontAwesomeIcon
              icon={faCompass}
              className="w-8 h-8 text-gray-700 cursor-pointer transition duration-500 ease-in-out transform-gpu hover:rotate-180 rotate-0"
              to="/profile"
              title="Explore"
            />
          </div>
          <div className="relative inline-block">
            <FontAwesomeIcon
              icon={faUserFriends}
              className="w-8 h-8 text-gray-700 hover:text-gray-600 cursor-pointer"
              to="/profile"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs">
              2
            </span>
          </div>
          <div className="relative inline-block">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-8 h-8 text-gray-700 hover:text-gray-600 cursor-pointer"
              to="/profile"
            />
            <span className="shadow-md absolute -top-2 -right-3 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white font-extrabold text-xs text-center">
              5
            </span>
          </div>
        </div>
        <div className="relative flex flex-row space-x-2 items-start">
          <a href="/profile">
            <img
              src="default.svg"
              className="inline-block mr-2 w-10 rounded-full bg-white ring-2 ring-gray-300"
            />
            <p className="inline-block text-md text-center font-semibold text-gray-700 group-hover:text-gray-700 subpixel-antialiased">
              {localStorage.getItem("username")}
            </p>
          </a>
          <Menu as="div" className="relative inline-block text-center">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button>
                    <FontAwesomeIcon
                      icon={faSortDown}
                      className="w-5 h-7 text-gray-700 cursor-pointer focus:outline-none"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="origin-top-right absolute -right-2 mt-4 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="select-none">
                      <Menu.Item>
                        <div className="px-8 py-2 cursor-default select-none">
                          <p className="inline-block text-gray-700 text-sm font-medium tracking-wide">
                            Signed in as
                          </p>{" "}
                          {localStorage.getItem("username") && (
                            <p className="inline-block text-sm font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                              {localStorage.getItem("username")}
                            </p>
                          )}
                        </div>
                      </Menu.Item>
                      <hr></hr>
                      <Menu.Item>
                        <a
                          href="#"
                          className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50"
                        >
                          Profile
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          href="#"
                          className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50"
                        >
                          Settings
                        </a>
                      </Menu.Item>
                      <hr></hr>
                      <Menu.Item>
                        <a
                          href="#"
                          onClick={SignOut}
                          className="text-gray-700 block px-8 py-2 text-sm font-medium tracking-wide hover:bg-gray-50"
                        >
                          Sign out
                        </a>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
