import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

import Post from "../lib/post";
import Comment from "../lib/comment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as faBookmarkFull,
  faStar as faStarFull,
  faFlag as faFlagFull,
  faArrowAltCircleUp as faArrowAltCircleUpFull,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as faBookmarkEmpty,
  faStar as faStarEmpty,
  faFlag as faFlagEmpty,
  faArrowAltCircleUp as faArrowAltCircleUpEmpty,
} from "@fortawesome/free-regular-svg-icons";
import { useAppSelector } from "../redux/hooks";
import User from "../lib/user";
import { useEffect } from "react";

interface FormInputs {
  content: string;
}

function CommentsRender(props: any) {
  const date = props.comment.date.toUTCString();

  return (
    <div className="px-4 py-2 space-y-2 bg-white">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-4">
          <Link
            href="/${props.comment.author.username}"
            as={"/" + props.comment.author.username}
          >
            <div>
              {props.comment.author.pic && (
                <img src={props.comment.author.pic} />
              )}
              {!props.comment.author.pic && (
                <img
                  src="default.svg"
                  className="focus:outline-none w-9 rounded-full bg-white ring-2 ring-gray-300"
                />
              )}
            </div>
          </Link>
          <div className="w-11/12 text-justify text-sm rounded-3xl bg-gray-100 border border-gray-200 p-2 px-4">
            <Link
              href="/${props.comment.author.username}"
              as={"/" + props.comment.author.username}
            >
              <p className="focus:outline-none float-left mr-2 w-auto text-gray-700 text-sm font-semibold hover:text-gray-900 subpixel-antialiased cursor-pointer">
                {props.comment.author.username}
              </p>
            </Link>
            {props.comment.content}
          </div>
        </div>
      </div>
      <p className="text-left ml-16 self-center text-xs font-medium text-gray-500 tracking-tighter">
        {date}
      </p>
    </div>
  );
}

function PostRender(props: any) {
  const serverDate = new Date(props.post.date_created);

  const [commentsList, setcommentsList] = useState(props.post.comments);

  const [voteState] = useState([
    faArrowAltCircleUpEmpty,
    faArrowAltCircleUpFull,
  ]);

  let [currentVoteState, setCurrentVoteState] = useState(0);
  let currentVote = voteState[currentVoteState];

  function Upvote() {
    if (currentVoteState == 0) setCurrentVoteState((currentVoteState = 1));
    else setCurrentVoteState((currentVoteState = 0));
    currentVote = voteState[currentVoteState];
  }

  const [bookmarkState] = useState([faBookmarkEmpty, faBookmarkFull]);
  let [currentBookmarkState, setCurrentBookmarkState] = useState(0);
  let currentBookmark = bookmarkState[currentBookmarkState];

  function Mark() {
    if (currentBookmarkState == 0)
      setCurrentBookmarkState((currentBookmarkState = 1));
    else setCurrentBookmarkState((currentBookmarkState = 0));
    currentBookmark = bookmarkState[currentBookmarkState];
  }

  const [reportState] = useState([faFlagEmpty, faFlagFull]);
  let [currentReportState, setCurrentReportState] = useState(0);
  let currentFlag = reportState[currentReportState];

  function Report() {
    if (currentReportState == 0)
      setCurrentReportState((currentReportState = 1));
    else setCurrentReportState((currentReportState = 0));
    currentFlag = reportState[currentReportState];
  }

  return (
    <div
      className={
        "w-full shadow py-4 m-auto bg-white rounded-xl space-y-6 divide-y divide-gray-300 " +
        props.post.style
      }
    >
      <div className="px-8 space-y-4">
        <div className="flex flex-row justify-between">
          <Link href="/${props.post.author}" as={"/" + props.post.author}>
            <div className="focus:outline-none w-max flex flex-row space-x-2 group cursor-pointer">
              {props.post.author.avatar && (
                <img src={props.post.author.avatar} />
              )}
              {!props.post.author.avatar && (
                <img
                  src="default.svg"
                  className="w-9 rounded-full bg-white ring-2 ring-gray-300"
                />
              )}
              <div>
                <h3 className="text-left text-gray-700 text-sm font-semibold group-hover:text-gray-900 subpixel-antialiased">
                  {props.post.author}
                </h3>
                <p className="text-xs font-medium text-gray-500 tracking-tighter">
                  {serverDate.toUTCString()}
                </p>
              </div>
            </div>
          </Link>
          <div className="flex flex-row space-x-4">
            <FontAwesomeIcon
              icon={currentVote}
              className="w-5 text-gray-400 hover:text-purple-400 cursor-pointer	self-start"
              onClick={Upvote}
            />
            <FontAwesomeIcon
              icon={currentBookmark}
              className="w-5 h-5 text-gray-400 hover:text-green-400 cursor-pointer	self-start"
              onClick={Mark}
            />
            <FontAwesomeIcon
              icon={currentFlag}
              className="w-5 text-gray-400 hover:text-red-400 cursor-pointer	self-start"
              onClick={Report}
            />
          </div>
        </div>

        <p className=" text-sm font-regular text-justify subpixel-antialiased">
          {props.post.content}
        </p>
      </div>
      <div className="px-4 pt-2 space-y-2">
        <form className="flex flex-col px-4 py-2 space-y-2 bg-white">
          <div className="flex flex-row justify-between items-center space-x-4">
            <a href="/profile" className="w-max focus:outline-none">
              <img
                src="default.svg"
                className="w-9 rounded-full bg-white ring-2 ring-gray-300"
              />
            </a>
            <input
              placeholder="Leave a comment ..."
              className="w-full p-2 px-4 rounded-3xl bg-gray-100 border border-gray-200 focus:shadow-inner focus:outline-none text-sm text-justify subpixel-antialiased"
              required
            />
          </div>
        </form>
        {props.post.comments &&
          commentsList.map((comment: Comment) => (
            <CommentsRender key={comment.id} comment={comment} />
          ))}
      </div>
    </div>
  );
}

export default function Feed(props: any) {
  const currentUser = useAppSelector((state) => state.currentUser);

  let initialList = props.postsList;
  if (!props.postsList) {
    initialList = [];
  }

  let [list, setList] = useState(initialList);

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    await fetch(`https://api.strugl.cc/posts`, {
      method: "Post",
      credentials: "include",
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.ok) {
        const id = await res.text();

        setList((arr: []) => [
          {
            id: parseInt(id),
            author: currentUser.username,
            author_id: currentUser.id,
            content: data.content,
            date_created: new Date(),
            style: "state2",
          },
          ...arr,
        ]);
      }
      reset({ content: "" });
    });
  }, []);

  return (
    <div className="col-span-2 w-full content-center text-center flex flex-col space-y-2">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="shadow px-8 py-4 bg-white border-2 border-gray-100 border-opacity-60 rounded-xl space-y-2 flex flex-col"
      >
        <div className="flex flex-row justify-between items-center space-x-4">
          <Link href="/${currentUser.username}" as={"/" + currentUser.username}>
            <a className="w-max focus:outline-none">
              <img
                src="default.svg"
                className="focus:outline-none w-9 rounded-full bg-white ring-2 ring-gray-300"
              />
            </a>
          </Link>

          <input
            {...register("content", {
              required: "Content is required.",
            })}
            placeholder="Share something with your friends today"
            autoComplete="off"
            type="search"
            className="w-full overflow-y-scroll p-2 px-4 rounded-3xl bg-gray-100 border border-gray-200 focus:shadow-inner focus:outline-none text-sm text-justify subpixel-antialiased"
            required
          />
        </div>
      </form>
      <div
        className={
          "overflow-y-scroll sticky rounded-xl space-y-2 " + props.feedType
        }
      >
        {list &&
          list.map((post: any) => <PostRender key={post.id} post={post} />)}
        {list.length == 0 && props.feedType == "profileFeed" && (
          <div className="h-full rounded-xl flex flex-col space-y-4 justify-items-center justify-center">
            <img src="duckbutticon.svg" className="h-1/4" />
            <p className="text-2xl font-semibold text-gray-600 subpixel-antialiased">
              No posts yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
