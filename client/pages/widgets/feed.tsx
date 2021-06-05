import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Post from "../../lib/post";
import User from "../../lib/user";
import Comment from "../../lib/comment";

// Données de tests (à supprimer après)
let testDate = new Date(2021, 3, 25, 17, 43);
const siham = new User(34, "sihamais", "sihamais98@gmail.com");
const paco = new User(32, "paco", "sihamais98@gmail.com");
const comment1 = new Comment(12, siham, "Nice !", testDate);
const comment2 = new Comment(
  15,
  paco,
  "Your really the best coder !",
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

function CommentsRender(props: any) {
  const date = props.comment.date.toUTCString();

  return (
    <div className="px-8 py-2 space-y-2 bg-white border-2 border-gray-100 border-opacity-60">
      <div className="flex flex-row justify-between">
        <a href="/profile">
          <div className="w-min flex flex-row content-between items-center space-x-2">
            {props.comment.author.pic && <img src={props.comment.author.pic} />}
            {!props.comment.author.pic && (
              <img
                src="default.svg"
                className="w-10 rounded-full bg-white ring-2 ring-gray-300"
              />
            )}
            <h3 className="font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              {props.comment.author.username}
            </h3>
          </div>
        </a>
        <p className="text-right self-center text-xs font-semibold text-gray-500 tracking-tighter">
          {date}
        </p>
      </div>

      <p className="px-12 text-md font-regular text-justify font-serif subpixel-antialiased">
        {props.comment.content}
      </p>
    </div>
  );
}

function PostRender(props: any) {
  const date = props.post.date.toUTCString();
  return (
    <div className="py-4 shadow bg-white border-2 border-gray-100 border-opacity-60 rounded-lg space-y-6 subpixel-antialiased">
      <div className="px-8 space-y-6">
        <div className="flex flex-row justify-between">
          <a href="/profile" className="hover:text-indigo-600">
            <div className="w-min flex flex-row content-between items-center space-x-2">
              {props.post.author.pic && <img src={props.post.author.pic} />}
              {!props.post.author.pic && (
                <img
                  src="default.svg"
                  className="w-10 rounded-full bg-white ring-2 ring-gray-300"
                />
              )}
              <h3 className="font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent hover:text-indigo-600">
                {props.post.author.username}
              </h3>
            </div>
          </a>
          <p className="text-right text-xs font-semibold text-gray-500 tracking-tighter">
            {date}
          </p>
        </div>

        <p className="text-md font-regular text-justify font-serif subpixel-antialiased">
          {props.post.content}
        </p>
      </div>
      <div className="px-4 space-y-2">
        {props.post.comments &&
          props.post.comments.map((comment: Comment) => (
            <CommentsRender key={props.post.id} comment={comment} />
          ))}
        <form className="flex flex-col px-8 py-2 space-y-2 bg-white border-2 border-gray-100 border-opacity-60">
          <textarea
            placeholder="Comment this post ..."
            className="mt-2 p-2 rounded-md border focus:shadow-inner border-gray-300 focus:outline-none text-md text-justify font-serif subpixel-antialiased"
          ></textarea>
          <button className="text-sm shadow self-end w-min p-2 rounded-lg bg-indigo-600 text-white font-semibold tracking-wide hover:bg-opacity-90">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Feed() {
  return (
    <div className="w-full flex-grow m-auto content-center text-center flex flex-col space-y-4">
      <form className="px-8 py-4 shadow bg-white border-2 border-gray-100 border-opacity-60 rounded-lg space-y-4 flex flex-col">
        <textarea
          placeholder="Share something with your friends today ..."
          className="mt-2 p-2 rounded-md border focus:shadow-inner border-gray-300 focus:outline-none text-md text-justify font-serif subpixel-antialiased"
        ></textarea>
        <button className="text-sm shadow self-end w-min p-2 rounded-lg bg-indigo-600 text-white font-semibold tracking-wide hover:bg-opacity-90">
          Post
        </button>
      </form>
      {PostsList.map((post: Post) => (
        <PostRender key={post.id} post={post} />
      ))}
    </div>
  );
}
