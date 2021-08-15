import Comment from "./comment";
import Topic from "./topic";

export default class Post {
  id: number;
  author: string;
  author_id: number;
  content: string;
  date_created: Date;
  
  author_avatar?: string;
  date_updated?: Date;
  comments?: Comment[];
  topics?: Topic[];

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
    this.date_created = new Date(date_created);
  }

  extractTopics(): Array<string> {
    let topics: Array<string> = [];

    this.content.split(" ").forEach((value) => {
      if (value[0] == "#") topics.push(value);
    });

    return topics;
  }
}
