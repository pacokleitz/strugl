import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import React from "react";
import Head from "next/head";

interface FormInputs {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export default function SignUp() {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>({ mode: "onChange" });
  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log(data);

  return (
    <div className="w-screen h-screen">
      <Head>
        <title>Strugl - Sign Up</title>
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
            className="shadow-2xl rounded-md bg-gray-100 w-auto m-auto justify-center space-y-8 flex flex-col p-10"
          >
            <div className="w-full space-y-3 flex flex-col m-auto font-semibold ">
              <div className="flex flex-col">
                <label className="text-gray-600">Username</label>
                <input
                  {...register("username", {
                    required: "Username is required.",
                    maxLength: {
                      value: 20,
                      message: "Username exceed max length.",
                    },
                    pattern: {
                      value: /^[0-9a-zA-Z]+$/,
                      message: "Username is alphanumeric characters.",
                    },
                  })}
                  type="text"
                  className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                ></input>
                {errors.username && (
                  <p className="text-red-800 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Email</label>
                <input
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Email had invalid format.",
                    },
                  })}
                  className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                ></input>
                {errors.email && (
                  <p className="text-red-800 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600">Password</label>
                <input
                  {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 8, message: "Password too short." },
                  })}
                  type="password"
                  placeholder="At least 8 characters"
                  className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                ></input>
                {errors.password && (
                  <p className="text-red-800 text-sm">
                    {errors.password.message}
                  </p>
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
                  type="password"
                  className="shadow-sm rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50"
                ></input>
                {errors.passwordCheck && (
                  <p className="text-red-800 text-sm">
                    {errors.passwordCheck.message}
                  </p>
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
              <Link href="/login">
                <a className="text-center underline font-semibold cursor-pointer text-blue-600 hover:text-blue-500">
                  Already have an account ? <br></br>Log In
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}