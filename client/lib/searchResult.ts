export default class SearchResult {
  id: number;
  name: string;
  type: string;
  avatar?: string;
  profilename?: string;

  constructor(
    id: number,
    name: string,
    type: string,
    avatar?: string,
    profilename?: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    if (avatar) this.avatar = avatar;
    if (profilename) this.profilename = profilename;
  }
}
