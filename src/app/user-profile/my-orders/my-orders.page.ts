import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {SaleControllerServiceService} from '../../_dal/ipohdrum';
import {commonConfig} from '../../_dal/common/commonConfig';
import {LoadingService} from '../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {MainBlogManagementModalPage} from '../my-blog/main-blog-management-modal/main-blog-management-modal.page';
import {ModalController} from '@ionic/angular';
import {ViewOrderDetailsModalPage} from './view-order-details-modal/view-order-details-modal.page';

@Component({
    selector: 'app-my-orders',
    templateUrl: './my-orders.page.html',
    styleUrls: ['./my-orders.page.scss'],
})

export class MyOrdersPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';

    // Numbers
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Arrays
    listOfUsersOrders: Array<any> = [];

    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    getListOfUsersOrdersSubscription: any;
    appendListOfUsersOrdersSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private modalController: ModalController,
        private loadingService: LoadingService,
        private globalFunctionService: GlobalfunctionService,
        private saleControllerService: SaleControllerServiceService
    ) {}

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveListOfUsersOrders();
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
            if (this.getListOfUsersOrdersSubscription) {
                this.getListOfUsersOrdersSubscription.unsubscribe();
            }
            if (this.appendListOfUsersOrdersSubscription) {
                this.appendListOfUsersOrdersSubscription.unsubscribe();
            }
        });
    }

    retrieveListOfUsersOrders() {
        this.loadingService.present();
        if (this.getListOfUsersOrdersSubscription) {
            this.getListOfUsersOrdersSubscription.unsubscribe();
        }
        this.getListOfUsersOrdersSubscription = this.saleControllerService.getUserSales(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfUsersOrders = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfUsersOrders = [];
                this.maximumPages = 0;
                this.totalResult = 0;
                this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Orders, please try again later!', 'danger');
            }
            this.loadingService.dismiss();
        }, error => {
            this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Orders, please try again later!', 'danger');
            this.listOfUsersOrders = [];
            this.maximumPages = 0;
            this.totalResult = 0;
            this.loadingService.dismiss();
        });
    }

    async openViewOrderDetailsModal(selectedOrderId: number, selectedOrderUid: string) {
        const modal = await this.modalController.create({
            component: ViewOrderDetailsModalPage,
            componentProps: {
                selectedOrderId,
                selectedOrderUid
            }
        });
        return await modal.present();
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        if (this.getListOfUsersOrdersSubscription) {
            this.getListOfUsersOrdersSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfUsersOrdersSubscription = this.saleControllerService.getUserSales(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfUsersOrders = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Orders, please try again later!', 'danger');
                this.listOfUsersOrders = [];
                this.maximumPages = 0;
                this.totalResult = 0;
            }
            this.ref.detectChanges();
            event.target.complete();
        }, error => {
            this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Orders, please try again later!', 'danger');
            this.listOfUsersOrders = [];
            this.maximumPages = 0;
            this.totalResult = 0;
            this.ref.detectChanges();
            event.target.complete();
        });
    }

    loadMoreUserOrders(event) {
        this.referInfiniteScroll = event;
        setTimeout(() => {
            if (this.maximumPages > this.currentPageNumber) {
                this.currentPageNumber++;
                this.appendListOfUsersOrdersSubscription = this.saleControllerService.getUserSales(
                    this.currentPageNumber,
                    this.currentPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const tempUserOrders of resp.data) {
                            this.listOfUsersOrders.push(tempUserOrders);
                        }
                    }
                    this.ref.detectChanges();
                    this.referInfiniteScroll.target.complete();
                }, error => {
                    this.referInfiniteScroll.target.complete();
                });
            }
            if (this.totalResult === this.listOfUsersOrders.length) {
                this.referInfiniteScroll.target.disabled = true;
            }
        }, 500);
    }
}
