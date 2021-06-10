import User from "./user";

export default class Message {
  id: number;
  author: User;
  content: string;
  date: Date;

  constructor(id: number, author: User, content: string, date: Date) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.date = date;
  }
}
