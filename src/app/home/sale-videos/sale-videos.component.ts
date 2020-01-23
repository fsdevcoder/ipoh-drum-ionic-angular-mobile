import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from '../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {PlaySelectedVideoModalPage} from './play-selected-video-modal/play-selected-video-modal.page';
import {Video, VideoControllerServiceService} from '../../_dal/ipohdrum';
import {commonConfig} from '../../_dal/common/commonConfig';

@Component({
    selector: 'app-sale-videos',
    templateUrl: './sale-videos.component.html',
    styleUrls: ['./sale-videos.component.scss'],
})

export class SaleVideosComponent implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';

    // Booleans
    isLoadingListOfPublicVideos = true;
    playSelectedVideoModalOpen = false;

    // Numbers
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Arrays
    listOfPublicVideos: Array<Video> = [];

    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    getListOfVideosSubscription: any;
    appendListOfVideosSubscription: any;

    constructor(
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private globalFunctionService: GlobalfunctionService,
        private modalController: ModalController,
        private videoControllerService: VideoControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.getListOfVideos();
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
            if (this.getListOfVideosSubscription) {
                this.getListOfVideosSubscription.unsubscribe();
            }
            if (this.appendListOfVideosSubscription) {
                this.appendListOfVideosSubscription.unsubscribe();
            }
        });
    }

    getListOfVideos() {
        this.isLoadingListOfPublicVideos = true;
        if (this.getListOfVideosSubscription) {
            this.getListOfVideosSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfVideosSubscription = this.videoControllerService.getPublicVideos(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfPublicVideos = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfPublicVideos = [];
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Videos, please try again later!', 'warning', 'top');
            }
            this.isLoadingListOfPublicVideos = false;
        }, error => {
            console.log('API Error while retrieving list of Public Videos');
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Videos, please try again later!', 'warning', 'top');
            this.isLoadingListOfPublicVideos = false;
            this.listOfPublicVideos = [];
        });
    }

    playSelectedVideo(publicVideoUid: string) {
        this.openModalToPlaySelectedVideo(publicVideoUid);
    }

    async openModalToPlaySelectedVideo(publicVideoUid) {
        if (!this.playSelectedVideoModalOpen) {
            this.playSelectedVideoModalOpen = true;
            const modal = await this.modalController.create({
                component: PlaySelectedVideoModalPage,
                componentProps: {
                    publicVideoUid
                }
            });
            modal.onDidDismiss().then(() => {
                this.playSelectedVideoModalOpen = false;
            });
            return await modal.present();
        }
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        if (this.getListOfVideosSubscription) {
            this.getListOfVideosSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfVideosSubscription = this.videoControllerService.getPublicVideos(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfPublicVideos = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfPublicVideos = [];
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Videos, please try again later!', 'warning', 'top');
                console.log('Unable to retrieve list of Videos.');
            }
            event.target.complete();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Videos, please try again later!', 'warning', 'top');
            this.listOfPublicVideos = [];
            console.log('API Error while retrieving list of Videos.');
            event.target.complete();
        });
    }

    loadMoreVideos(event) {
        this.referInfiniteScroll = event;
        setTimeout(() => {
            if (this.maximumPages > this.currentPageNumber) {
                this.currentPageNumber++;
                this.appendListOfVideosSubscription = this.videoControllerService.getPublicVideos(
                    this.currentPageNumber,
                    this.currentPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const tempPublicVideo of resp.data) {
                            this.listOfPublicVideos.push(tempPublicVideo);
                        }
                    }
                    this.referInfiniteScroll.target.complete();
                }, error => {
                    console.log('API Error while retrieving list of videos');
                    this.referInfiniteScroll.target.complete();
                });
            }
            if (this.totalResult === this.listOfPublicVideos.length) {
                this.referInfiniteScroll.target.disabled = true;
            }
        }, 500);
    }
}
