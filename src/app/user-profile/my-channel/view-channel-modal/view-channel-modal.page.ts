import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Channel, ChannelControllerServiceService} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {EditChannelModalPage} from '../edit-channel-modal/edit-channel-modal.page';
import {LoadingService} from '../../../_dal/common/services/loading.service';

@Component({
  selector: 'app-view-channel-modal',
  templateUrl: './view-channel-modal.page.html',
  styleUrls: ['./view-channel-modal.page.scss'],
})

export class ViewChannelModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedChannelUid: string;

  // Booleans
  isLoadingChannelInfo = true;
  companyBelongingsFlag = false;
  editChannelModalOpen = false;

  // Objects
  selectedChannel: Channel;

  // Subscriptions
  getSelectedChannelByUidSubscription: any;
  deleteChannelSubscription: any;

  constructor(
      private loadingService: LoadingService,
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private globalFunctionService: GlobalfunctionService,
      private channelControllerService: ChannelControllerServiceService,
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveSelectedChannelByUid();
    });
  }

  ngOnDestroy() {
    this.unsubscribeSubscriptions();
  }

  ionViewDidLeave() {
    this.unsubscribeSubscriptions();
  }

  unsubscribeSubscriptions() {
    this.ngZone.run(() => {
      if (this.getSelectedChannelByUidSubscription) {
        this.getSelectedChannelByUidSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedChannelByUid() {
    this.isLoadingChannelInfo = true;
    if (this.getSelectedChannelByUidSubscription) {
      this.getSelectedChannelByUidSubscription.unsubscribe();
    }
    this.getSelectedChannelByUidSubscription = this.channelControllerService.getChannelByUid(
        this.selectedChannelUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedChannel = resp.data;
        this.companyBelongingsFlag = resp.data.companyBelongings === 1;
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Channel info, please try again later!', 'danger');
        this.closeViewChannelModal();
      }
      this.isLoadingChannelInfo = false;
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retriving selected Channel by uid.');
      console.log(error);
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Channel info, please try again later!', 'danger');
      this.closeViewChannelModal();
      this.isLoadingChannelInfo = false;
      this.ref.detectChanges();
    });
  }

  closeViewChannelModal() {
    this.modalController.dismiss();
  }

  async openEditChannelModal() {
    if (!this.editChannelModalOpen) {
      this.editChannelModalOpen = true;
      const modal = await this.modalController.create({
        component: EditChannelModalPage,
        componentProps: {
          selectedChannelUid: this.selectedChannelUid
        }
      });
      modal.onDidDismiss().then((returnFromEditingChannel) => {
        this.editChannelModalOpen = false;
        if (returnFromEditingChannel.data) {
          this.retrieveSelectedChannelByUid();
        }
      });
      return await modal.present();
    }
  }

  deleteChannel() {
    this.globalFunctionService.presentAlertConfirm(
        'WARNING',
        'Are you sure you want to delete the selected Channel?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.actuallyDeleteChannel()
    );
  }

  actuallyDeleteChannel() {
    this.loadingService.present();
    if (this.deleteChannelSubscription) {
      this.deleteChannelSubscription.unsubscribe();
    }
    this.deleteChannelSubscription = this.channelControllerService.deleteChannelByUid(
        this.selectedChannelUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Channel has been deleted!', 'success');
        this.closeViewChannelModal();
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Channel, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while deleting the Channel');
      console.log(error);
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Channel, please try again later!', 'danger');
      this.ref.detectChanges();
    });
  }
}
