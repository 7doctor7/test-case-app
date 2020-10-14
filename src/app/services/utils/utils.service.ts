import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';

export interface AlertDataInterface {
  header?: string;
  subHeader?: string;
  message: string;
  buttons?: any[];
  cssClass?: string;
  inputs?: any[];
  backdropDismiss?: boolean;
}

export interface ToastDataInterface {
  header?: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  cssClass?: string;
  color?: string;
  buttons?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public isLoading = false;
  public loadingEl: HTMLIonLoadingElement;

  constructor(
    private alrtCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  public async presentAlert(data: AlertDataInterface): Promise<void> {
    const buttons = data.buttons ? data.buttons : ['OK'];
    const cssClass = data.header
      ? 'full ' + (data.cssClass ? data.cssClass : 'success')
      : 'noHeader ' + (data.cssClass ? data.cssClass : 'success');
    const inputs = data.inputs ? data.inputs : [];

    const alrt = await this.alrtCtrl.create({
      ...data,
      buttons,
      cssClass,
      inputs,
      backdropDismiss: false,
    });

    return await alrt.present();
  }

  public async presentToast(data: ToastDataInterface): Promise<void> {
    const toast = await this.toastCtrl.create({
      ...data,
      color: data.color ? data.color : 'success',
      buttons: data.buttons ? data.buttons : [{ side: 'end', text: 'OK', role: 'cancel' }],
    });

    await toast.present();
  }

  public async presentActionSheet(data: AlertDataInterface): Promise<void> {
    const actionCtrl = await this.actionSheetCtrl.create({
      buttons: data.buttons ? data.buttons : ['OK'],
      header: data.header ? data.header : null,
      subHeader: data.subHeader ? data.subHeader : null,
      backdropDismiss: data.backdropDismiss ? data.backdropDismiss : true,
    });

    return await actionCtrl.present();
  }

  public async presentLoading(data: any): Promise<boolean> {
    const topLoader = await this.loadingCtrl.getTop();

    this.isLoading = true;

    if (topLoader) {
      this.loadingCtrl.dismiss();
    }

    const opts = {
      cssClass: 'app-loading',
      message: data.message ? data.message : null,
      showBackdrop: data.showBackdrop ? data.showBackdrop : false,
      spinner: data.spinner ? data.spinner : 'bubbles',
    };

    this.loadingEl = await this.loadingCtrl.create(opts);
    this.loadingEl.present();

    return true;
  }

  public async dismissLoading(): Promise<void> {
    let topLoader = await this.loadingCtrl.getTop();

    if (!this.loadingEl) {
      this.isLoading = false;
      return;
    }

    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        this.isLoading = false;
        return;
      }

      topLoader = await this.loadingCtrl.getTop();
    }
  }
}
