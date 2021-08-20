export default class Alert {
  content: string;
  type: string;
  color: string;

  constructor(type: string, content: string) {
    this.type = type;
    this.content = content;
    if (this.type === "error") this.color = "red";
    else if (this.type === "info") this.color = "blue";
    else this.color = "green";
  }
}
