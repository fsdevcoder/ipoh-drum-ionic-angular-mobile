import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {SaleControllerServiceService, SaleItem} from '../../../_dal/ipohdrum';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {ViewSalesOrderModalPage} from '../view-sales-order-modal/view-sales-order-modal.page';

@Component({
  selector: 'app-sales-order-management-modal',
  templateUrl: './sales-order-management-modal.page.html',
  styleUrls: ['./sales-order-management-modal.page.scss'],
})

export class SalesOrderManagementModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';

  // Numbers
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  totalResult: number;

  // Arrays
  listOfSalesOrders: Array<SaleItem> = [];

  // Objects
  referInfiniteScroll: any;

  // Subscriptions
  getListOfSalesOrdersSubscription: any;
  appendListOfSalesOrdersSubscription: any;

  constructor(
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private saleControllerService: SaleControllerServiceService
  ) {}

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveListOfSalesOrderManagement();
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
      if (this.getListOfSalesOrdersSubscription) {
        this.getListOfSalesOrdersSubscription.unsubscribe();
      }
      if (this.appendListOfSalesOrdersSubscription) {
        this.appendListOfSalesOrdersSubscription.unsubscribe();
      }
    });
  }

  retrieveListOfSalesOrderManagement() {
    this.loadingService.present();
    if (this.getListOfSalesOrdersSubscription) {
      this.getListOfSalesOrdersSubscription.unsubscribe();
    }
    this.getListOfSalesOrdersSubscription = this.saleControllerService.getSales(
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfSalesOrders = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.listOfSalesOrders = [];
        this.maximumPages = 0;
        this.totalResult = 0;
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Sales Order, please try again later!', 'warning', 'top');
      }
      this.loadingService.dismiss();
    }, error => {
      this.listOfSalesOrders = [];
      this.maximumPages = 0;
      this.totalResult = 0;
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Sales Order, please try again later!', 'warning', 'top');
      this.loadingService.dismiss();
    });
  }

  closeSalesOrderManagementModal() {
    this.modalController.dismiss();
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfSalesOrdersSubscription) {
      this.getListOfSalesOrdersSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfSalesOrdersSubscription = this.saleControllerService.getSales(
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfSalesOrders = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Sales Order, please try again later!', 'warning', 'top');
        this.listOfSalesOrders = [];
        this.maximumPages = 0;
        this.totalResult = 0;
      }
      event.target.complete();
    }, error => {
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Sales Order, please try again later!', 'warning', 'top');
      this.listOfSalesOrders = [];
      this.maximumPages = 0;
      this.totalResult = 0;
      event.target.complete();
    });
  }

  loadMoreSalesOrderFromSelectedStore(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfSalesOrdersSubscription = this.saleControllerService.getSales(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempSalesOrder of resp.data) {
              this.listOfSalesOrders.push(tempSalesOrder);
            }
          }
          this.referInfiniteScroll.target.complete();
        }, error => {
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfSalesOrders.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }

  async openViewSalesOrderManagementModal(selectedSalesOrderId: number, selectedSalesOrderUid: string) {
    const modal = await this.modalController.create({
      component: ViewSalesOrderModalPage,
      componentProps: {
        selectedSalesOrderId,
        selectedSalesOrderUid
      }
    });
    return await modal.present();
  }
}
