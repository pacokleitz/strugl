import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import Alert from "../components/alert";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CreateAccount } from "../services/actions";

interface FormInputs {
  username: string;
  password: string;
  passwordCheck: string;
}

export default function SignUp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const alert = useAppSelector((state) => state.alerts.list[0]);

  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    CreateAccount(dispatch, router, data);
  }, []);

  return (
    <div className="w-screen h-screen">
      <Head>
        <title>Strugl - Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen min-h-screen h-auto bg-gradient-to-br from-indigo-600 to-indigo-300 content-center justify-center">
        <div className="">
          {alert && <Alert alert={alert} />}

          <div className="flex md:flex-row flex-col m-auto min-h-screen h-auto content-center md:w-2/3 md:space-x-10 p-5">
            <div className="font-bold text-6xl tracking-tight mx-auto grid justify-center content-center w-10/12 md:w-1/2 my-5">
              <h1 className="text-white text-5xl">Strugl</h1>
              <h1 className="text-black text-4xl">
                Your privacy-conscious social network
              </h1>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="shadow-2xl rounded-md bg-gray-100 w-auto m-auto justify-center space-y-8 flex flex-col p-10"
            >
              <div className="w-full space-y-3 flex flex-col m-auto font-semibold ">
                <div className="flex flex-col">
                  <label className="text-gray-600">Username</label>
                  <input
                    {...register("username", {
                      required: "Username is required.",
                      maxLength: {
                        value: 25,
                        message: "Username exceed max length.",
                      },
                      pattern: {
                        value: /^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/,
                        message: "Username format is invalid.",
                      },
                    })}
                    maxLength={25}
                    type="text"
                    className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                  ></input>
                  {errors.username && (
                    <span className="text-red-700 text-sm font-medium">
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600">Password</label>
                  <input
                    {...register("password", {
                      required: "Password is required.",
                      minLength: { value: 8, message: "Password too short." },
                    })}
                    minLength={8}
                    type="password"
                    className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                  ></input>
                  {errors.password && (
                    <span className="text-red-700 text-sm font-medium">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-600">Confirm password</label>
                  <input
                    {...register("passwordCheck", {
                      required: "Confirm password is required.",
                      validate: {
                        matchesPreviousPassword: (value) => {
                          return (
                            value === getValues("password") ||
                            "Passwords don't match."
                          );
                        },
                      },
                    })}
                    minLength={8}
                    type="password"
                    className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                  ></input>
                  {errors.passwordCheck && (
                    <span className="text-red-700 text-sm font-medium">
                      {errors.passwordCheck.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center m-auto space-y-3">
                <button
                  type="submit"
                  className="bg-gray-700 text-gray-100 w-1/2 p-2 
                    rounded-lg m-auto hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 font-semibold"
                >
                  Sign Up
                </button>
                <Link href="/login" as="/">
                  <a className="text-center underline font-semibold cursor-pointer text-blue-600 hover:text-blue-500">
                    Already have an account ? <br></br>Log In
                  </a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
