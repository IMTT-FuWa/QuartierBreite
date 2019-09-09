export class EmergencyContacts {

  public name: string;
  public position: string;
  public tel: string;
  public mail: string;
  public address: string;

  constructor(contact, position, tel, mail, address) {
    contact.user = contact;
    this.position = position;
    this.tel = tel;
    this.mail = mail;
    this.address = address;
  }
}
