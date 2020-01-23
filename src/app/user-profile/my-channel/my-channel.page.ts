import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from '../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {ChannelControllerServiceService} from '../../_dal/ipohdrum';
import {Channel} from '../../_dal/ipohdrum/model/channel';
import {AddChannelModalPage} from './add-channel-modal/add-channel-modal.page';
import {MainChannelManagementModalPage} from './main-channel-management-modal/main-channel-management-modal.page';
import {commonConfig} from '../../_dal/common/commonConfig';

@Component({
    selector: 'app-my-channel',
    templateUrl: './my-channel.page.html',
    styleUrls: ['./my-channel.page.scss'],
})

export class MyChannelPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';

    // Numbers
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Booleans
    mainChannelManagementModalOpen = false;
    createChannelModalOpen = false;

    // Arrays
    listOfCurrentUsersChannels: Array<Channel> = [];

    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    getListOfChannelsOfCurrentUserSubscription: any;
    appendListOfChannelsOfCurrentUserSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private channelControllerService: ChannelControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveListOfChannelsOfCurrentUser();
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
            if (this.getListOfChannelsOfCurrentUserSubscription) {
                this.getListOfChannelsOfCurrentUserSubscription.unsubscribe();
            }
            if (this.appendListOfChannelsOfCurrentUserSubscription) {
                this.appendListOfChannelsOfCurrentUserSubscription.unsubscribe();
            }
        });
    }

    retrieveListOfChannelsOfCurrentUser() {
        this.loadingService.present();
        if (this.getListOfChannelsOfCurrentUserSubscription) {
            this.getListOfChannelsOfCurrentUserSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfChannelsOfCurrentUserSubscription = this.channelControllerService.getChannels(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            console.log(resp);
            if (resp.code === 200) {
                this.listOfCurrentUsersChannels = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfCurrentUsersChannels = [];
                this.maximumPages = 0;
                this.totalResult = 0;
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channels list info, please try again later!', 'warning', 'top');
                console.log('Unable to retrieve list of Channels');
            }
            this.loadingService.dismiss();
            this.ref.detectChanges();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channels list info, please try again later!', 'warning', 'top');
            this.listOfCurrentUsersChannels = [];
            this.loadingService.dismiss();
            this.ref.detectChanges();
            console.log('API Error while retrieving list of Channels of current user');
        });
    }

    async openCreateChannelModal() {
        if (!this.createChannelModalOpen) {
            this.createChannelModalOpen = true;
            const modal = await this.modalController.create({
                component: AddChannelModalPage
            });
            modal.onDidDismiss().then((returnFromCreatingChannel) => {
                this.createChannelModalOpen = false;
                if (returnFromCreatingChannel.data) {
                    this.retrieveListOfChannelsOfCurrentUser();
                    if (this.referInfiniteScroll) {
                        this.referInfiniteScroll.target.disabled = false;
                    }
                }
            });
            return await modal.present();
        }
    }

    async openMainChannelManagementModal(selectedChannelId: number, selectedChannelUid: string) {
        if (!this.mainChannelManagementModalOpen) {
            this.mainChannelManagementModalOpen = true;
            const modal = await this.modalController.create({
                component: MainChannelManagementModalPage,
                cssClass: 'channel-management-modal',
                componentProps: {
                    selectedChannelId,
                    selectedChannelUid
                }
            });
            modal.onDidDismiss().then((refreshPageFlag) => {
                this.mainChannelManagementModalOpen = false;
                if (refreshPageFlag.data) {
                    this.retrieveListOfChannelsOfCurrentUser();
                    if (this.referInfiniteScroll) {
                        this.referInfiniteScroll.target.disabled = false;
                    }
                }
            });
            return await modal.present();
        }
    }

    loadMoreChannels(event) {
        this.referInfiniteScroll = event;
        setTimeout(() => {
            if (this.maximumPages > this.currentPageNumber) {
                this.currentPageNumber++;
                this.appendListOfChannelsOfCurrentUserSubscription = this.channelControllerService.getChannels(
                    this.currentPageNumber,
                    this.currentPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const tempChannels of resp.data) {
                            this.listOfCurrentUsersChannels.push(tempChannels);
                        }
                    }
                    this.ref.detectChanges();
                    this.referInfiniteScroll.target.complete();
                }, error => {
                    console.log('API Error while retrieving list of Channels of current User');
                    this.referInfiniteScroll.target.complete();
                });
            }
            if (this.totalResult === this.listOfCurrentUsersChannels.length) {
                this.referInfiniteScroll.target.disabled = true;
            }
        }, 500);
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        if (this.getListOfChannelsOfCurrentUserSubscription) {
            this.getListOfChannelsOfCurrentUserSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfChannelsOfCurrentUserSubscription = this.channelControllerService.getChannels(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfCurrentUsersChannels = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfCurrentUsersChannels = [];
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channels list info, please try again later!', 'warning', 'top');
                console.log('Unable to retrieve list of Channels');
            }
            this.ref.detectChanges();
            event.target.complete();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channels list info, please try again later!', 'warning', 'top');
            this.listOfCurrentUsersChannels = [];
            console.log('API Error while retrieving list of Channels of current User');
            event.target.complete();
        });
    }
}
