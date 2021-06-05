import Post from "./post";
import User from "./user";

export default class Subject {
  id: number;
  title: string;
  pic?: string;
  posts?: Post[];
  followers?: User[];

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }
}
