import User from "./user";
import Comment from "./comment";

export default class Post {
  id: number;
  author: string;
  author_id: number;
  content: string;
  date_created: Date;

  date_updated?: Date;
  comments?: Comment[];

  constructor(
    id: number,
    author: string,
    author_id: number,
    content: string,
    date_created: Date
  ) {
    this.id = id;
    this.author = author;
    this.author_id = author_id;
    this.content = content;
    this.date_created = date_created;
  }
}
