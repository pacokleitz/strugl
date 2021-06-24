import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Header from "../components/header";
import Suggestions from "../components/suggestions";

function PostsRender(props: any) {
  return <div></div>;
}
function ProfileContent({ user }: any) {
  return <div className="col-span-3"></div>;
}

export default function Profile() {
  const router = useRouter();
  const { profile } = router.query;

  return (
    <div className="min-h-screen h-auto w-screen max-w-full bg-gray-100 ">
      <Head>
        {typeof window !== "undefined" && <title>Strugl - {profile}</title>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="max-w-full w-screen grid grid-cols-4 px-4 m-auto gap-4 justify-between pb-4">
        <ProfileContent />
        <Suggestions />
      </div>
    </div>
  );
}

ProfileContent.getInitialProps = async (ctx: any) => {
  await fetch("https://api.strugl.cc/api/users/${ctx.query}", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const json = await res.json();
    return { user: json };
  });
};
