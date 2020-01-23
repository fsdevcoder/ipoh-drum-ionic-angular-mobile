import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Comment, Video, VideoControllerServiceService} from '../../../../_dal/ipohdrum';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {EditVideoModalPage} from '../edit-video-modal/edit-video-modal.page';

@Component({
  selector: 'app-view-video-modal',
  templateUrl: './view-video-modal.page.html',
  styleUrls: ['./view-video-modal.page.scss'],
})

export class ViewVideoModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedVideoUid: string;

  // Numbers
  selectedVideoId: number;
  selectedChannelId: number;

  // Booleans
  isLoadingVideoInfo = true;
  isVideoPublicScope = false;

  // Objects
  selectedVideo: Video;

  // Subscriptions
  getSelectedVideoByUidSubscription: any;
  deleteVideoSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private videoControllerService: VideoControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveSelectedVideoByUid();
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
      if (this.getSelectedVideoByUidSubscription) {
        this.getSelectedVideoByUidSubscription.unsubscribe();
      }
      if (this.deleteVideoSubscription) {
        this.deleteVideoSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedVideoByUid() {
    this.isLoadingVideoInfo = true;
    if (this.getSelectedVideoByUidSubscription) {
      this.getSelectedVideoByUidSubscription.unsubscribe();
    }
    this.getSelectedVideoByUidSubscription = this.videoControllerService.getVideoByUid(
        this.selectedVideoUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedVideo = resp.data;
        this.selectedVideo.scope === 'public' ? this.isVideoPublicScope = true : this.isVideoPublicScope = false;
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Video info, please try again later!', 'danger');
        this.closeViewVideoModal();
      }
      this.isLoadingVideoInfo = false;
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving selected Video by uid.');
      console.log(error);
      this.isLoadingVideoInfo = false;
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Video info, please try again later!', 'danger');
      this.closeViewVideoModal();
      this.ref.detectChanges();
    });
  }

  closeViewVideoModal() {
    this.modalController.dismiss();
  }

  async openEditVideoModal() {
    const modal = await this.modalController.create({
      component: EditVideoModalPage,
      componentProps: {
        selectedVideoUid: this.selectedVideoUid,
        selectedChannelId: this.selectedChannelId
      }
    });
    modal.onDidDismiss().then((returnFromEditingVideo) => {
      if (returnFromEditingVideo.data) {
        this.retrieveSelectedVideoByUid();
      }
    });
    return await modal.present();
  }

  deleteVideo() {
    this.globalFunctionService.presentAlertConfirm(
        'WARNING',
        'Are you sure you want to delete the selected Video?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.actuallyDeleteVideo()
    );
  }

  actuallyDeleteVideo() {
    this.loadingService.present();
    if (this.deleteVideoSubscription) {
      this.deleteVideoSubscription.unsubscribe();
    }
    this.deleteVideoSubscription = this.videoControllerService.deleteVideoByUid(
        this.selectedVideoUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Video has been deleted!', 'success');
        this.closeViewVideoModal();
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete Video, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while deleting the Video');
      console.log(error);
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete Video, please try again later!', 'danger');
      this.ref.detectChanges();
    });
  }
}
