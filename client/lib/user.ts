import Subject from "./subject";

export default class User {
  id: number;
  username: string;
  pic?: string;
  email: string;
  followers?: User[] = [];

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
