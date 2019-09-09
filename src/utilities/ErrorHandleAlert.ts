import { AlertController } from 'ionic-angular';

export function errorHandleAlert(_alertCtrl: AlertController, title: string, subTitle: string) {
  // constructor(public alertCtrl: AlertController) {
  // }

  let alert = this.alertCtrl.create({
    title: title,
    subTitle: subTitle,
    buttons: ['OK']
  });
  alert.present();

}
