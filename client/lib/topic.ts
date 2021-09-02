import User from "./user";

export default class Topic {
  topic_id: number;
  topic_name: string;
  followers?: User[];
  style?: string;

  constructor(id: number, title: string) {
    this.topic_id = id;
    this.topic_name = title;
  }
}
