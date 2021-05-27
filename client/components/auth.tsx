import { useState } from "react";


export default function Auth() {
    const [pages] = useState([SignIn(), SignUp()]); // true for sign in, false for sign up
    let [currentPageIdx, setCurrentPage] = useState(0);
    let currentPage = pages[currentPageIdx];

  function SwitchPage() {
    if(currentPageIdx == 1)
        setCurrentPage(currentPageIdx = 0);
    else
        setCurrentPage(currentPageIdx = 1);
    currentPage = pages[currentPageIdx];
  }

  function SignUp(){
    return (
        <div className="shadow-lg rounded-md bg-gray-100 w-auto m-auto justify-center space-y-8 flex flex-col p-10">
            <div className="w-full space-y-3 flex flex-col m-auto font-semibold ">
                <div className="flex flex-col">
                    <label className="text-gray-600">Username</label>
                    <input className="rounded-md px-2 py-1 font-semibold"></input>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-600">Email</label>
                    <input className="rounded-md px-2 py-1 font-semibold"></input>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-600">Password</label>
                    <input className="rounded-md px-2 py-1 font-semibold"></input>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-600">Confirm password</label>
                    <input className="rounded-md px-2 py-1 font-semibold"></input>
                </div>
            </div>
            <div className="flex flex-col justify-center m-auto space-y-3">
                <button className="bg-gray-600 text-gray-100 w-1/2 p-2 
                    rounded-lg m-auto hover:bg-gray-500 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 font-semibold">Sign up</button>
                <a className="text-center underline font-semibold cursor-pointer text-blue-600 hover:text-blue-500" onClick={SwitchPage}>
                    Already have an account ? <br></br>Sign In.</a>
            </div>
        </div>
    )
    }

    function SignIn(){
        return (
            <div className="shadow-lg rounded-md bg-gray-100 m-auto justify-center space-y-8 flex flex-col p-10">
                <div className="w-full space-y-3 flex flex-col m-auto font-semibold">
                    <div className="flex flex-col">
                        <label className="text-gray-600">Username or Email</label>
                        <input className="rounded-md px-2 py-1 font-semibold"></input>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Password</label>
                        <input className="rounded-md px-2 py-1 font-semibold"></input>
                    </div>
                </div>
                <div className="flex flex-col justify-center m-auto space-y-3">
                    <button className="bg-gray-600 text-gray-100 w-1/2 p-2 
                    rounded-lg m-auto hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 font-semibold">Sign in</button>
                    <a className="text-center underline font-semibold cursor-pointer text-blue-600 hover:text-blue-500" onClick={SwitchPage}>
                        Don't have an account ? <br></br>Sign Up</a>
                </div>
            </div>
        )
    }
    
    return(
        <div className="w-screen min-h-screen h-auto bg-indigo-700 content-center justify-center">
            <div className="flex md:flex-row flex-col m-auto min-h-screen h-auto content-center md:w-2/3 md:space-x-10 p-5">
                <div className="font-extrabold text-5xl tracking-tight mx-auto grid justify-center content-center w-1/2 mb-5">
                    <h1 className="text-gray-100">Strugl</h1>
                    <h1 className="text-black text-4xl">Your privacy-conscious social network</h1>
                </div>
                {currentPage}
            </div>
        </div>
    )
}