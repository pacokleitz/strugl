import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

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
import { AddBookmark, AddPost, RemoveBookmark } from "../services/actions";
import { useRouter } from "next/router";

export interface FormInputs {
  content: string;
}

function CommentsRender(props: any) {
  const date = props.comment.date.toUTCString();

  return (
    <div className="px-4 py-2 space-y-2 bg-white dark:bg-gray-850">
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
                <div className="focus:outline-none w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain " />
              )}
            </div>
          </Link>
          <div className="w-11/12 text-justify text-sm rounded-3xl bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-850 p-2 px-4">
            <Link
              href="/${props.comment.author.username}"
              as={"/" + props.comment.author.username}
            >
              <p className="focus:outline-none float-left mr-2 w-auto text-gray-700 dark:text-gray-300 text-sm font-semibold hover:text-black dark:hover:text-gray-200 subpixel-antialiased cursor-pointer">
                {props.comment.author.username}
              </p>
            </Link>
            {props.comment.content}
          </div>
        </div>
      </div>
      <p className="text-left ml-16 self-center text-xs font-medium text-gray-500 dark:text-gray-400 tracking-tighter">
        {date}
      </p>
    </div>
  );
}

function PostRender(props: any) {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const isBookmarked = useAppSelector((state) =>
    state.bookmarks.list.find((post) => post.id === props.post.id)
  );

  let thisPost = new Post(
    props.post.id,
    props.post.author,
    props.post.author_pname,
    props.post.author_id,
    props.post.content,
    props.post.date_created
  );

  props.post.avatar ? (thisPost.avatar = props.post.avatar) : null;

  thisPost.topics = thisPost.extractTopics();
  thisPost.mentions = thisPost.extractMentions();

  let content = thisPost.content.split(" ");

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

  function Mark() {
    if (!isBookmarked) {
      AddBookmark(dispatch, props.post);
    } else {
      RemoveBookmark(dispatch, props.post.id);
    }
  }

  // const [reportState] = useState([faFlagEmpty, faFlagFull]);
  // let [currentReportState, setCurrentReportState] = useState(0);

  // function Report() {
  //   if (currentReportState == 0)
  //     setCurrentReportState((currentReportState = 1));
  //   else setCurrentReportState((currentReportState = 0));
  // }

  return (
    <div
      className={
        "w-full shadow py-2 pt-4 m-auto bg-white dark:bg-gray-850 rounded-xl space-y-2 animate-" +
        props.post.style +
        (isLogged || commentsList
          ? " divide-y divide-gray-300 dark:divide-gray-950"
          : "")
      }
    >
      <div className="px-4 space-y-2">
        <div className="flex flex-row justify-between">
          <Link href={`/${encodeURIComponent(thisPost.author)}`}>
            <div className="focus:outline-none w-max flex flex-row space-x-2 group cursor-pointer">
              {thisPost.avatar && (
                <img
                  src={thisPost.avatar}
                  className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
                />
              )}
              {!thisPost.avatar && (
                <div className="w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain" />
              )}
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center space-x-1">
                  <h3 className="text-left text-gray-700 dark:text-gray-300 text-sm font-semibold group-hover:text-black dark:group-hover:text-gray-200 subpixel-antialiased">
                    {thisPost.author_pname}
                  </h3>
                  <p className="text-sm text-center font-medium italic text-gray-500 subpixel-antialiased">
                    {"@" + thisPost?.author}
                  </p>
                </div>

                <div className="group flex space-x-1 text-xs font-medium text-indigo-500 dark:text-indigo-400 tracking-tighter">
                  <p>{thisPost.date_created.toDateString()}</p>
                  <p className="invisible group-hover:visible dark:text-gray-300 text-gray-600">
                    at
                  </p>
                  <p className="invisible group-hover:visible ">
                    {thisPost.date_created.toLocaleTimeString()}
                  </p>
                </div>
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
              icon={isBookmarked ? faBookmarkFull : faBookmarkEmpty}
              className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer	self-start"
              onClick={Mark}
            />
            {/* <FontAwesomeIcon
              icon={currentFlag}
              className="w-5 text-gray-400 hover:text-red-400 cursor-pointer	self-start"
              onClick={Report}
            /> */}
          </div>
        </div>

        <p className="text-sm font-regular text-justify subpixel-antialiased py-1">
          {content.map((word: string, index) => {
            if (thisPost.topics?.includes(word)) {
              return (
                <span key={index}>
                  <Link href={`/topic/${encodeURIComponent(word.slice(1))}`}>
                    <span className="text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                      {word.toString()}
                    </span>
                  </Link>
                  <span> </span>
                </span>
              );
            } else if (thisPost.mentions?.includes(word)) {
              return (
                <span key={index}>
                  <Link href={`/${encodeURIComponent(word.slice(1))}`}>
                    <span className="text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                      {word.toString()}
                    </span>
                  </Link>
                  <span> </span>
                </span>
              );
            } else
              return (
                <span key={index} className="dark:text-gray-300">
                  {word.toString() + " "}
                </span>
              );
          })}
        </p>
      </div>
      {(isLogged || commentsList) && (
        <div className="px-2 pt-2 space-y-2">
          {isLogged && (
            <form className="flex flex-col px-4 py-1 space-y-2 bg-white dark:bg-gray-850">
              <div className="flex flex-row justify-between items-center space-x-4 focus:outline-none">
                <Link href={`/${encodeURIComponent(currentUser.username)}`}>
                  <a className="w-max focus:outline-none">
                    {currentUser.avatar && (
                      <img
                        src={currentUser.avatar}
                        className="focus:outline-none w-10 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
                      />
                    )}
                    {!currentUser.avatar && (
                      <div className="focus:outline-none w-10 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain" />
                    )}
                  </a>
                </Link>
                <input
                  placeholder="Leave a comment ..."
                  className="w-full overflow-y-scroll p-2 px-4 rounded-3xl bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 dark:text-gray-200 focus:shadow-inner focus:outline-none text-sm text-justify subpixel-antialiased"
                  required
                  disabled
                />
              </div>
            </form>
          )}
          {props.post.comments &&
            commentsList.map((comment: Comment) => (
              <CommentsRender key={comment.id} comment={comment} />
            ))}
        </div>
      )}
    </div>
  );
}

export default function Feed(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const feed = props.feed;
  const { profile } = router.query;

  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const hasInput =
    isLogged &&
    ((feed.type === "profileFeed" &&
      profile &&
      currentUser.username === profile[0]) ||
      feed.type !== "profileFeed")
      ? true
      : false;

  const { register, handleSubmit, setValue, reset } = useForm<FormInputs>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    if (props.topic && !data.content.includes("#" + props.topic)) {
      setValue("content", (data.content += " #" + props.topic));
    }

    AddPost(dispatch, data, currentUser).then(() => {
      reset({ content: "" });
    });
  }, []);

  return (
    <div className="max-w-5xl col-span-2 w-full content-center text-center flex flex-col space-y-2 scrollbar-hidden">
      {hasInput && (
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="shadow px-4 py-2 bg-white dark:bg-gray-850 border-2 border-gray-100 dark:border-gray-850 border-opacity-60 rounded-xl space-y-2 flex flex-col"
        >
          <div className="flex flex-row justify-between items-center space-x-4">
            <Link href={`/${encodeURIComponent(currentUser.username)}`}>
              <a className="w-max focus:outline-none">
                {currentUser.avatar && (
                  <img
                    src={currentUser.avatar}
                    className="focus:outline-none w-10 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-800 object-contain"
                  />
                )}
                {!currentUser.avatar && (
                  <div className="focus:outline-none w-9 h-9 rounded-full bg-gray-200 ring-2 ring-gray-200 dark:ring-gray-400" />
                )}
              </a>
            </Link>

            <input
              {...register("content", {
                required: "Content is required.",
              })}
              placeholder="Share something with your friends today"
              autoComplete="off"
              type="search"
              className="w-full overflow-y-scroll p-2 px-4 rounded-3xl bg-gray-100 dark:text-gray-200 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 focus:shadow-inner focus:outline-none text-sm text-justify subpixel-antialiased"
              required
            />
          </div>
        </form>
      )}
      <div
        className={
          "overflow-y-scroll sticky rounded-xl space-y-2 " +
          feed.type +
          (hasInput ? "" : " noInput")
        }
      >
        {feed.list &&
          feed.list.map((post: Post) => (
            <PostRender key={post.id} post={post} />
          ))}
        {feed.list && feed.list.length == 0 && feed.type == "profileFeed" && (
          <div className="h-full rounded-xl flex flex-col space-y-4 justify-items-center justify-center">
            <img src="/duckbutticon.svg" className="w-1/6 self-center" />
            <p className="text-sm text-center font-semibold text-gray-500 dark:text-gray-400 subpixel-antialiased">
              No posts yet
            </p>
          </div>
        )}
        {feed.list.length == 0 && feed.type == "dashboardFeed" && (
          <p className="text-sm text-center font-semibold text-gray-400 subpixel-antialiased">
            Follow a user or a topic to start using Strugl
          </p>
        )}
        {feed.list.length == 0 && feed.type == "bookmarksFeed" && (
          <div className="h-full rounded-xl flex flex-col space-y-4 justify-items-center justify-center">
            <p className="text-sm text-center font-semibold dark:text-gray-400 text-gray-500 subpixel-antialiased">
              No bookmarks yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
