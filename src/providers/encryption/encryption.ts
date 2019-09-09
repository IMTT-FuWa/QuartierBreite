import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionProvider {

  private createPassword(timestamp: string, sender: string) {
    
    let unixTimeS = new Date(timestamp).getTime() / 1000;
    let timestampS: string = unixTimeS.toString();
    let password = timestampS.substring(6, 8) + sender + timestampS.substring(15, 1) + timestampS.substring(3, 5);
    return password;
  }

  public encrypt(message: string, timestamp: string, sender: string): string {
    let password = this.createPassword(timestamp, sender);
    let messageBase64 = window.btoa(encodeURIComponent(message));
    let encrypted = CryptoJS.AES.encrypt(messageBase64, password);
    return encrypted.toString();
  };

  public decrypt(encrypted: string, timestamp: string, sender: string): string {
    let password = this.createPassword(timestamp, sender);
    let decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
    let wordArray = decodeURIComponent(window.atob(decrypted));
    return wordArray;
  };


}
