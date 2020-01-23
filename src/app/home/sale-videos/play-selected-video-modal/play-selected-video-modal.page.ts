import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Comment, Video, VideoControllerServiceService} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {PaymentInfoModalPage} from '../../../shared/payment-info-modal/payment-info-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../_dal/common/services/authentication.service';

@Component({
    selector: 'app-play-selected-video-modal',
    templateUrl: './play-selected-video-modal.page.html',
    styleUrls: ['./play-selected-video-modal.page.scss'],
})

export class PlaySelectedVideoModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    publicVideoUid: string;
    videoUrl: string;

    // Numbers
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Boolean
    isLoadingSelectedVideo = true;
    paymentModalOpen = false;

    // Arrays
    listOfCommentsForSelectedVideo: Array<Comment> = [];

    // Objects
    selectedPublicVideo: Video;
    referInfiniteScroll: any;

    // Subscriptions
    getVideoByIdSubscription: any;
    getListOfCommentsBySelectedVideoSubscription: any;
    appendListOfCommentsBySelectedVideoSubscription: any;

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private authenticationService: AuthenticationService,
        private videoControllerService: VideoControllerServiceService,
        private globalFunctionService: GlobalfunctionService,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveSelectedPublicVideoByUid();
            // this.retrieveListOfCommentsBySelectedVideo();
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
           if (this.getVideoByIdSubscription) {
               this.getVideoByIdSubscription.unsubscribe();
           }
           if (this.getListOfCommentsBySelectedVideoSubscription) {
               this.getListOfCommentsBySelectedVideoSubscription.unsubscribe();
           }
           if (this.appendListOfCommentsBySelectedVideoSubscription) {
               this.appendListOfCommentsBySelectedVideoSubscription.unsubscribe();
           }
        });
    }

    retrieveSelectedPublicVideoByUid() {
        this.isLoadingSelectedVideo = true;
        if (this.getVideoByIdSubscription) {
            this.getVideoByIdSubscription.unsubscribe();
        }
        this.getVideoByIdSubscription = this.videoControllerService.getPublicVideoByUid(
            this.publicVideoUid
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.selectedPublicVideo = resp.data;
                this.videoUrl = this.selectedPublicVideo.videopath;
            } else {
                this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the selected Video, please try again later!', 'danger');
                this.closePlaySelectedVideoModal();
            }
            this.isLoadingSelectedVideo = false;
        }, error => {
            this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the selected Video, please try again later!', 'danger');
            this.closePlaySelectedVideoModal();
            this.isLoadingSelectedVideo = false;
        });
    }

/*    retrieveListOfCommentsBySelectedVideo() {
        if (this.getListOfCommentsBySelectedVideoSubscription) {
            this.getListOfCommentsBySelectedVideoSubscription.unsubscribe();
        }
        this.getListOfCommentsBySelectedVideoSubscription = this.videoControllerService.getPublicVideoComments(
            this.publicVideoUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfCommentsForSelectedVideo = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfCommentsForSelectedVideo = [];
                this.maximumPages = 0;
                this.totalResult = 0;
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Comments, please revisit the page later.', 'warning');
            }
        }, error => {
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Comments, please revisit the page later.', 'warning');
        });
    }*/

    closePlaySelectedVideoModal() {
        this.modalController.dismiss();
    }

    async openPaymentInfoModal() {
        if (this.authenticationService.isUserLoggedIn()) {
            if (!this.paymentModalOpen) {
                this.paymentModalOpen = true;
                const modal = await this.modalController.create({
                    component: PaymentInfoModalPage,
                    cssClass: 'payment-info-modal',
                    componentProps: {
                        buyInventoryFlag: false,
                        buyVideoFlag: true,
                        videoId: this.selectedPublicVideo.id
                    }
                });
                modal.onDidDismiss().then((returnFromSuccessfulPayment) => {
                    if (returnFromSuccessfulPayment.data) {
                        setTimeout(() => {
                            this.closePlaySelectedVideoModal();
                        }, 500);
                    }
                });
                return await modal.present();
            }
        } else {
            this.globalFunctionService.presentAlertConfirm(
                'WARNING',
                'Please login first before proceeding to make any transaction-related actions.',
                'Cancel',
                'Login',
                undefined,
                () => this.actuallyRouteToLoginPage()
            );
        }
    }

    actuallyRouteToLoginPage() {
        this.closePlaySelectedVideoModal();
        this.router.navigate(['login']);
    }

/*    loadMoreComments(event) {
        this.referInfiniteScroll = event;
        if (this.selectedPublicVideo.commentcount > 0) {
            setTimeout(() => {
                if (this.maximumPages > this.currentPageNumber) {
                    this.currentPageNumber++;
                    this.appendListOfCommentsBySelectedVideoSubscription = this.videoControllerService.getPublicVideoComments(
                        this.publicVideoUid,
                        this.currentPageNumber,
                        this.currentPageSize
                    ).subscribe(resp => {
                        if (resp.code === 200) {
                            for (const tempComment of resp.data) {
                                this.listOfCommentsForSelectedVideo.push(tempComment);
                            }
                        }
                        this.referInfiniteScroll.target.complete();
                    }, error => {
                        this.referInfiniteScroll.target.complete();
                    });
                }
                if (this.totalResult === this.listOfCommentsForSelectedVideo.length) {
                    this.referInfiniteScroll.target.disabled = true;
                }
            }, 500);
        }
    }*/
}
