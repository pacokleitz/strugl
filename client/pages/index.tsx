import { useRouter } from 'next/router'
import Head from "next/head";
import React from 'react';
import Auth from '../components/auth';

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen">
      <Head>
        <title>Strugl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Auth />
    </div>
  )
}
