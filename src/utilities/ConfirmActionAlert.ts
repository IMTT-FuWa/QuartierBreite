import { AlertController } from 'ionic-angular';

export function confirmAction(alert: AlertController, title: string, message: string, acceptCb?: Function, cancelCb?: Function) {
  let alertPopup = alert.create({
    title: title,
    message: message,
    buttons: [
      {
        text: 'Ja',
        handler: () => {
          acceptCb && acceptCb();
        }
      },
      {
        text: 'Nein',
        role: 'cancel',
        handler: () => {
          cancelCb && cancelCb();
        }
      }
    ]
  });
  alertPopup.present();
  // nav.present(alert);
}
