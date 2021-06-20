import { useQuery } from "react-query";

const login = async (username:string, password:string) => {
  const fetched = await fetch("https://api.strugl.cc/8080");
  const result = fetched.json();
  return result;
};

const logAuto = async (token: string) => {
  const fetched = await fetch("https://api.strugl.cc/8080", {
    method: "Post",
    body: JSON.stringify(token),
  });
  const result = fetched.json();
  return result;
};

const signup = async (username:string, email:string, password:string) => {
  const fetched = await fetch("https://api.strugl.cc/8080");
  const result = fetched.json();
  return result;
};

const fetchUser = async (token: string) => {
  const fetched = await fetch("https://api.strugl.cc/8080");
  const result = fetched.json();
  return result;
};

const deleteUser = async (token: string) => {
  const result = await fetch("https://api.strugl.cc/8080");
  return result;
};

const useUser = (token: string) => {
  return useQuery("user", () => fetchUser(token));
};

export { useUser, fetchUser, deleteUser, signup, logAuto, login };
