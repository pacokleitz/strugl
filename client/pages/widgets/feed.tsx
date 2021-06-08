import Post from "../../lib/post";
import User from "../../lib/user";
import Comment from "../../lib/comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as faBookmarkFull,
  faStar as faStarFull,
  faArrowAltCircleUp as faArrowAltCircleUpFull,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark as faBookmarkEmpty,
  faStar as faStarEmpty,
  faArrowAltCircleUp as faArrowAltCircleUpEmpty,
} from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

// Données de tests (à supprimer après)
let testDate = new Date(2021, 3, 25, 17, 43);
const siham = new User(34, "Sihamais", "sihamais98@gmail.com");
const paco = new User(32, "Paco Kleitz", "sihamais98@gmail.com");
const comment1 = new Comment(
  12,
  siham,
  "Nice ! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto ut dolores et quo eos voluptatibus doloremque repudiandae nesciunt veniam, exercitationem quod quas, vel labore cumque recusandae libero autem iure inventore?",
  testDate
);
const comment2 = new Comment(
  15,
  paco,
  "Wow, you are really the best coder !",
  testDate
);

let PostsList: Post[] = [
  {
    id: 1,
    author: siham,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus, magnam mollitia rem pariatur officia illo nulla laboriosam autem voluptas culpa, laborum soluta repudiandae quae placeat maxime? Architecto, maiores reiciendis?",
    date: testDate,
    comments: [comment1, comment2, comment1],
  },
  {
    id: 2,
    author: paco,
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur ut magnam ipsa veritatis, magni debitis nulla, ab harum minus soluta laudantium amet a beatae libero unde aliquid voluptatibus expedita maiores.",
    date: testDate,
  },
  {
    id: 3,
    author: siham,
    content:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit, esse placeat. Provident placeat impedit eveniet itaque molestiae est porro nostrum. Est doloremque nulla quisquam quibusdam magni dolorum cum sit iste.",
    date: testDate,
  },
  {
    id: 4,
    author: paco,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus, magnam mollitia rem pariatur officia illo nulla laboriosam autem voluptas culpa, laborum soluta repudiandae quae placeat maxime? Architecto, maiores reiciendis?",
    date: testDate,
  },
];
// Fin des données de tests (à supprimer plus tard)

function CommentsRender(props: any) {
  const date = props.comment.date.toUTCString();

  return (
    <div className="px-4 py-2 space-y-2 bg-white">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-4">
          {props.comment.author.pic && <img src={props.comment.author.pic} />}
          {!props.comment.author.pic && (
            <a href="/profile" className="group">
              <img
                src="default.svg"
                className="w-10 rounded-full bg-white ring-2 ring-gray-300"
              />
            </a>
          )}
          <div className="w-11/12 text-justify rounded-3xl bg-gray-100 p-2 px-4">
            <a
              href="/profile"
              className="float-left mr-2  w-auto font-semibold text-gray-700 hover:text-gray-900 subpixel-antialiased"
            >
              {props.comment.author.username}
            </a>
            {props.comment.content}
          </div>
        </div>
      </div>
      <p className="text-left ml-16 self-center text-xs font-semibold text-gray-500 tracking-tighter">
        {date}
      </p>
    </div>
  );
}

function PostRender(props: any) {
  const date = props.post.date.toUTCString();
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

  return (
    <div className="shadow py-4 bg-white rounded-xl space-y-6 divide-y-2 divide-gray-300">
      <div className="px-8 space-y-4">
        <div className="flex flex-row justify-between">
          <a href="/profile" className="group">
            <div className="w-max flex flex-row space-x-2">
              {props.post.author.pic && <img src={props.post.author.pic} />}
              {!props.post.author.pic && (
                <img
                  src="default.svg"
                  className="w-10 rounded-full bg-white ring-2 ring-gray-300"
                />
              )}
              <div>
                <h3 className="text-left font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
                  {props.post.author.username}
                </h3>
                <p className="text-xs font-semibold text-gray-500 tracking-tighter">
                  {date}
                </p>
              </div>
            </div>
          </a>
          <div className="flex flex-row space-x-4">
            <FontAwesomeIcon
              icon={currentVote}
              className="w-5 text-gray-400 hover:text-purple-400 cursor-pointer	self-start"
              onClick={Upvote}
            />
            <FontAwesomeIcon
              icon={currentBookmark}
              className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer	self-start"
              onClick={Mark}
            />
          </div>
        </div>

        <p className=" text-md font-regular text-justify subpixel-antialiased">
          {props.post.content}
        </p>
      </div>
      <div className="px-4 py-2 space-y-2">
        {props.post.comments &&
          commentsList.map((comment: Comment) => (
            <CommentsRender key={props.post.id} comment={comment} />
          ))}
        <form className="flex flex-col px-4 py-2 space-y-2 bg-white">
          <div className="flex flex-row justify-between items-center space-x-4">
            <a href="/profile" className="w-max">
              <img
                src="default.svg"
                className="w-10 rounded-full bg-white ring-2 ring-gray-300"
              />
            </a>
            <input
              placeholder="Leave a comment ..."
              className="w-full p-2 px-4 rounded-3xl bg-gray-100 focus:shadow-inner focus:outline-none text-md text-justify subpixel-antialiased"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Feed() {
  const [list, setList] = useState(PostsList);

  return (
    <div className="col-span-2 w-full content-center text-center flex flex-col space-y-4">
      <form className="shadow px-8 py-4 bg-white border-2 border-gray-100 border-opacity-60 rounded-xl space-y-2 flex flex-col">
        <div className="flex flex-row justify-between items-center space-x-4">
          <a href="/profile" className="w-max">
            <img
              src="default.svg"
              className="w-10 rounded-full bg-white ring-2 ring-gray-300"
            />
          </a>
          <input
            placeholder="Share something with your friends today ..."
            className="w-full p-2 px-4 rounded-3xl bg-gray-100 focus:shadow-inner focus:outline-none text-md text-justify subpixel-antialiased"
            required
          />
        </div>
      </form>
      {list.map((post: Post) => (
        <PostRender key={post.id} post={post} />
      ))}
    </div>
  );
}
