export class BlackboardPost {

  public user: string;
  public timestamp: string;
  public title: string;
  public link: string;
  public description: string;
  public validUntil: string;

  constructor(user, title, description, link?, validUntil?) {
    this.timestamp = new Date().toISOString();
    this.user = user;
    this.title = title;
    this.description = description;
    if (link)
      this.link = link;
    if (validUntil)
      this.validUntil = validUntil;
  }


}
