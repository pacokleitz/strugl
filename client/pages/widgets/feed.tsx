import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Post from "../../lib/post";
import User from "../../lib/user";

const siham = new User(34, "sihamais", "sihamais98@gmail.com");
const paco = new User(32, "paco", "sihamais98@gmail.com");
let testDate = new Date(2021, 3, 25, 17, 43);

let PostsList: Post[] = [
  {
    id: 1,
    author: siham,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus, magnam mollitia rem pariatur officia illo nulla laboriosam autem voluptas culpa, laborum soluta repudiandae quae placeat maxime? Architecto, maiores reiciendis?",
    date: testDate,
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
  {
    id: 5,
    author: paco,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus, magnam mollitia rem pariatur officia illo nulla laboriosam autem voluptas culpa, laborum soluta repudiandae quae placeat maxime? Architecto, maiores reiciendis?",
    date: testDate,
  },
  {
    id: 6,
    author: siham,
    content:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus natus, magnam mollitia rem pariatur officia illo nulla laboriosam autem voluptas culpa, laborum soluta repudiandae quae placeat maxime? Architecto, maiores reiciendis?",
    date: testDate,
  },
];

function CommentsRender(props: any) {
  return <div></div>;
}

function PostRender(props: any) {
  const date = props.post.date.toUTCString();
  return (
    <div className="px-8 py-4 shadow-md bg-white border-2 border-gray-100 border-opacity-60 rounded-lg space-y-4">
      <div>
        <a href="/profile">
          <div className="flex flex-row content-between items-center space-x-2">
            <FontAwesomeIcon
              icon={faUserCircle}
              className="w-9 text-gray-700"
            />
            <h3 className="font-bold bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              {props.post.author.username}
            </h3>
          </div>
        </a>
        <p className="text-md font-regular text-justify font-serif subpixel-antialiased">
          {props.post.content}
        </p>
        <span className="text-right float-right self-end text-xs font-semibold text-gray-600 tracking-tighter">
          {date}
        </span>
      </div>
      <div>
        {props.post.comments.map((comment: Comment) => {
          <CommentsRender key={props.post.id} comment={comment} />;
        })}
      </div>
    </div>
  );
}

export default function Feed() {
  return (
    <div className="w-full flex-grow m-auto content-center text-center flex flex-col space-y-4">
      {PostsList.map((post: Post) => (
        <PostRender key={post.id} post={post} />
      ))}
    </div>
  );
}
