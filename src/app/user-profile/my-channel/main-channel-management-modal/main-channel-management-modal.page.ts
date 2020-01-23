import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ViewChannelModalPage} from '../view-channel-modal/view-channel-modal.page';
import {VideoManagementModalPage} from '../video-management-modal/video-management-modal.page';

@Component({
  selector: 'app-main-channel-management-modal',
  templateUrl: './main-channel-management-modal.page.html',
  styleUrls: ['./main-channel-management-modal.page.scss'],
})

export class MainChannelManagementModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedChannelUid: string;

  // Numbers
  selectedChannelId: number;

  // Booleans
  videoManagementModalOpen = false;
  viewChannelModalOpen = false;

  constructor(
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
  }

  async openViewSelectedChannelModal() {
    if (!this.viewChannelModalOpen) {
      this.viewChannelModalOpen = true;
      const modal = await this.modalController.create({
        component: ViewChannelModalPage,
        componentProps: {
          selectedChannelUid: this.selectedChannelUid
        }
      });
      modal.onDidDismiss().then(() => {
        this.viewChannelModalOpen = false;
      });
      return await modal.present();
    }
  }

  async openVideoManagementModal() {
    if (!this.videoManagementModalOpen) {
      this.videoManagementModalOpen = true;
      const modal = await this.modalController.create({
        component: VideoManagementModalPage,
        componentProps: {
          selectedChannelUid: this.selectedChannelUid,
          selectedChannelId: this.selectedChannelId
        }
      });
      modal.onDidDismiss().then(() => {
        this.videoManagementModalOpen = false;
      });
      return await modal.present();
    }
  }
}
