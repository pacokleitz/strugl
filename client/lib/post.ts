import Comment from "./comment";

export default class Post {
  id: number;
  author: string;
  author_id: number;
  author_pname: string;
  content: string;
  date_created: Date;

  avatar?: string;
  date_updated?: Date;
  comments?: Comment[];
  topics?: string[];
  mentions?: string[];

  constructor(
    id: number,
    author: string,
    author_pname: string,
    author_id: number,
    content: string,
    date_created: Date
  ) {
    this.id = id;
    this.author = author;
    this.author_pname = author_pname;
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

  extractMentions(): Array<string> {
    let mentions: Array<string> = [];

    this.content.split(" ").forEach((value) => {
      if (value[0] == "@") mentions.push(value);
    });

    return mentions;
  }
}
