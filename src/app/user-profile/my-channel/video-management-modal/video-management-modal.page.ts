import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ChannelControllerServiceService, Video} from '../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {ViewVideoModalPage} from './view-video-modal/view-video-modal.page';
import {CreateVideoModalPage} from './create-video-modal/create-video-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
  selector: 'app-video-management-modal',
  templateUrl: './video-management-modal.page.html',
  styleUrls: ['./video-management-modal.page.scss'],
})

export class VideoManagementModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedChannelUid: string;

  // Numbers
  selectedChannelId: number;
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  totalResult: number;

  // Arrays
  listOfVideosByChannelUid: Array<Video> = [];

  // Objects
  referInfiniteScroll: any;

  // Subscriptions
  getListOfVideosByChannelUidSubscription: any;
  appendListOfVideosByChannelUidSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private loadingService: LoadingService,
      private channelControllerService: ChannelControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveListOfVideosByChannelUid();
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
      if (this.getListOfVideosByChannelUidSubscription) {
        this.getListOfVideosByChannelUidSubscription.unsubscribe();
      }
    });
  }

  closeVideoManagementModal() {
    this.modalController.dismiss();
  }

  async openCreateVideoModal() {
    const modal = await this.modalController.create({
      component: CreateVideoModalPage,
      componentProps: {
        selectedChannelUid: this.selectedChannelUid,
        selectedChannelId: this.selectedChannelId
      }
    });
    modal.onDidDismiss().then((returnedFromCreatingVideo) => {
      if (returnedFromCreatingVideo.data) {
        this.retrieveListOfVideosByChannelUid();
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
      }
    });
    return await modal.present();
  }

  async openViewVideoModal(selectedVideoId: number, selectedVideoUid: string) {
    const modal = await this.modalController.create({
      component: ViewVideoModalPage,
      componentProps: {
        selectedVideoId,
        selectedVideoUid,
        selectedChannelId: this.selectedChannelId
      }
    });
    return await modal.present();
  }

  retrieveListOfVideosByChannelUid() {
    this.loadingService.present();
    if (this.getListOfVideosByChannelUidSubscription) {
      this.getListOfVideosByChannelUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfVideosByChannelUidSubscription = this.channelControllerService.getVideosByChannelUid(
        this.selectedChannelUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfVideosByChannelUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.listOfVideosByChannelUid = [];
        this.maximumPages = 0;
        this.totalResult = 0;
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Videos, please try again later!', 'warning', 'top');
      }
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving list of Videos by Channel Uid.');
      console.log(error);
      this.loadingService.dismiss();
      this.listOfVideosByChannelUid = [];
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Videos, please try again later!', 'warning', 'top');
      this.ref.detectChanges();
    });
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfVideosByChannelUidSubscription) {
      this.getListOfVideosByChannelUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfVideosByChannelUidSubscription = this.channelControllerService.getVideosByChannelUid(
        this.selectedChannelUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfVideosByChannelUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Videos, please try again later!', 'warning', 'top');
        this.listOfVideosByChannelUid = [];
      }
      this.ref.detectChanges();
      event.target.complete();
    }, error => {
      console.log('API Error while retrieving list of Videos by Channel uid.');
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Videos, please try again later!', 'warning', 'top');
      this.listOfVideosByChannelUid = [];
      event.target.complete();
    });
  }

  loadMoreVideosByChannelUid(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfVideosByChannelUidSubscription = this.channelControllerService.getVideosByChannelUid(
            this.selectedChannelUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempVideos of resp.data) {
              this.listOfVideosByChannelUid.push(tempVideos);
            }
          }
          this.ref.detectChanges();
          this.referInfiniteScroll.target.complete();
        }, error => {
          console.log('API Error while retrieving list of Videos by Channel uid.');
          console.log(error);
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfVideosByChannelUid.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }
}
