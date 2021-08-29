export default class Alert {
  content: string;
  type: string;
  color: string;
  status: string;

  constructor(type: string, content: string, color: string, status: string) {
    this.type = type;
    this.content = content;
    this.color = color;
    this.status = status;
  }
}
