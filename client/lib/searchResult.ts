export default class SearchResult {
  id: number;
  name: string;
  type: string;
  avatar?: string;

  constructor(id: number, name: string, type: string, avatar?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    if (avatar) this.avatar = avatar;
  }
}
