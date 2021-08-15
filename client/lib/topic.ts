import Post from "./post";

export default class Topic {
  id: number;
  name: string;
  followers: number;

  posts?: Array<Post>;

  constructor(id: number, name: string, followers: number) {
    this.id = id;
    this.name = name;
    this.followers = followers;
  }
}
