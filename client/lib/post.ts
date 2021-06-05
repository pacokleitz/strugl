import User from "./user"
import Comment from "./comment"

export default class Post {
    id: number;
    author: User;
    content: string;
    date: Date;
    comments?: Comment[];

    constructor(id: number, author: User, content: string, date:Date){
        this.id = id;
        this.author = author;
        this.content = content;
        this.date = date;
    }
}