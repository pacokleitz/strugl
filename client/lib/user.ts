import Subject from "./subject";

export default class User {
  id: number;
  username: string;
  pic?: string;
  email: string;
  token: string = '';
  friends?: User[] = [];
  interests?: Subject[] = [];

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  _setFriends(friends: User[]) {
    this.friends = friends;
  }
}
