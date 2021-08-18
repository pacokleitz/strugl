import Topic from "./topic";

export default class User {
  id: number;
  username: string;
  bio: string;
  profile_name: string;
  avatar: string;

  constructor(
    id: number,
    username: string,
    avatar: string,
    bio: string,
    profile_name: string
  ) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.bio = bio;
    this.profile_name = profile_name;
  }
}
