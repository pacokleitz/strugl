export default class Alert {
  id: number;
  content: string;
  type: string;
  color: string;
  date: Date;

  constructor(id: number, type: string, content: string, date: Date) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.date = date;
    if (this.type === "error") this.color = "red";
    else if (this.type === "info") this.color = "blue";
    else this.color = "green";
  }
}
