import Header from "../components/header";
import Feed from "./widgets/feed"
import Profile from "./widgets/profile"
import Suggestions from "./widgets/suggestions";

let chat: string[];

export default function Dashboard(context: any) {
  return (
    <div className="min-h-screen h-auto w-screen max-w-screen ">
      <Header />
      <div className="grid grid-flow-col w-auto px-4 m-auto gap-4 justify-between pb-4">
        <Profile />
        <Feed />
        <Suggestions />
      </div>
    </div>
  );
}

// Dashboard.getInitialProps = async () => {
//     // posts
// //   fetch("https://api.strugl.cc", {
// //     method: "GET",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({}),
// //   }).then(async (res) => {
// //     const json = await res.json();
// //     if (res.ok) {
// //       feed = json.posts;
// //     } else alert(json.error);
// //   });

// //   fetch("https://api.strugl.cc", {
// //     method: "GET",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({}),
// //   }).then(async (res) => {
// //     const json = await res.json();
// //     if (res.ok) {
// //       chat = json.chats;
// //     } else alert(json.error);
// //   });
// };
