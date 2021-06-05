import Post from "./post";
import User from "./user";

export default class Subject {
  id: number;
  title: string;
  pic?: string;
  posts?: Post[];
  followers?: User[];
  starred:boolean;

  constructor(id: number, title: string, starred:boolean) {
    this.id = id;
    this.title = title;
    this.starred = starred
  }
}
