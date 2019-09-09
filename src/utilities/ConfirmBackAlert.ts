import { AlertController } from 'ionic-angular';

export function confirmBack(alert: AlertController, acceptCb?: Function, cancelCb?: Function) {
  let alertPopup = alert.create({
    title: 'Abbruch',
    message: 'Sind Sie sicher, dass die den Vorgang abbrechen wollen?',
    buttons: [
      {
        text: 'Ja',
        handler: () => {
          acceptCb && acceptCb();
          onAccept();
          // onAccept(alert);
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

function onAccept() {
  // let nav: NavController;
  // function onAccept(nav: NavController) {
  // this is not a 'cancel' (role) handler, so we first pop the Alert
  // from the nav-stack. We have to wait till it is animated out to call
  // the secon pop() for navigate back to the previous page - otherwise we try
  // to pop the Alert twice, which won't work as expected!
  // this.nav.pop().then(() => {
  //     this.nav.pop();
  // });
}
