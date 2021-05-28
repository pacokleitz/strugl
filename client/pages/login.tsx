import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import React from "react";
import Head from "next/head";

interface FormInputs {
    username: string;
    email: string;
    password: string;
    passwordCheck : string;
}

export default function LogIn(){
        const { register, getValues, formState: { errors }, handleSubmit} = useForm<FormInputs>({mode: "onChange"});
    const onSubmit: SubmitHandler<FormInputs> = data => console.log(data);

        return (
          <div className="w-screen h-screen">
            <Head>
              <title>Strugl - Log In</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="w-screen min-h-screen h-auto bg-gradient-to-br from-indigo-600 to-indigo-300 content-center justify-center">
              <div className="flex md:flex-row flex-col m-auto min-h-screen h-auto content-center md:w-2/3 md:space-x-10 p-5">
                <div className="font-bold text-6xl tracking-tight mx-auto grid justify-center content-center w-10/12 md:w-1/2 my-5">
                  <h1 className="text-white text-5xl">Strugl</h1>
                  <h1 className="text-black text-4xl">
                    Your privacy-conscious social network
                  </h1>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="shadow-2xl rounded-md bg-gray-100 m-auto justify-center space-y-8 flex flex-col p-10"
                >
                  <div className="w-full space-y-3 flex flex-col m-auto font-semibold">
                    <div className="flex flex-col">
                      <label className="text-gray-600">Username or Email</label>
                      <input
                        {...register("username", {
                          required: "Username or Email is required.",
                        })}
                        type="email"
                        className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                      ></input>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-600">Password</label>
                      <input
                        {...register("password", {
                          required: "Password is required.",
                        })}
                        type="password"
                        className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                      ></input>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center m-auto space-y-3">
                    <button
                      type="submit"
                      className="bg-gray-700 text-gray-100 w-1/2 p-2 
                    rounded-lg m-auto hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 font-semibold"
                    >
                      Log In
                    </button>
                    <Link href="/signup">
                      <a className="text-center underline font-semibold cursor-pointer text-blue-600 hover:text-blue-500">
                        Don't have an account ? <br></br>Sign Up
                      </a>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
    }
