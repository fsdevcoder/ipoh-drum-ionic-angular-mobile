import { Injectable } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class GlobalfunctionService {

  constructor(
      private toastController: ToastController,
      private alertController: AlertController
  ) { }

  async simpleToast(header, msg, color, position?) {
    const toast = await this.toastController.create({
      header,
      message: msg,
      duration: 3000,
      color,
      position: (position !== undefined && position !== null) ? position : 'top',
      showCloseButton: true
    });
    toast.present();
  }

  async presentAlertConfirm(
      header,
      message,
      cancelButtonText,
      confirmButtonText,
      // tslint:disable-next-line:ban-types
      cancelCallbackFunction?: Function,
      // tslint:disable-next-line:ban-types
      confirmCallbackFunction?: Function
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelButtonText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            if (cancelCallbackFunction !== undefined) {
              cancelCallbackFunction();
            }
          }
        }, {
          text: confirmButtonText,
          handler: () => {
            if (confirmCallbackFunction !== undefined) {
              confirmCallbackFunction();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
