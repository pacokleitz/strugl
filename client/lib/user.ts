export default class User {
  id: number;
  username: string;
  email: string;
  token: string = '';
  friends?: User[] = [];

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  _setFriends(friends: User[]) {
    this.friends = friends;
  }
}
