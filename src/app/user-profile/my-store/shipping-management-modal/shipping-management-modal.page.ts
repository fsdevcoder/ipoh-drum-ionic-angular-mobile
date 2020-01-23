import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {AddShippingModalPage} from './add-shipping-modal/add-shipping-modal.page';
import {EditShippingModalPage} from './edit-shipping-modal/edit-shipping-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
  selector: 'app-shipping-management-modal',
  templateUrl: './shipping-management-modal.page.html',
  styleUrls: ['./shipping-management-modal.page.scss'],
})

export class ShippingManagementModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedStoreUid: string;

  // Numbers
  selectedStoreId: number;
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  totalResult: number;

  // Arrays
  listOfShippingsByStoreUid: Array<any> = [];

  // Objects
  referInfiniteScroll: any;

  // Subscriptions
  getListOfShippingsByStoreUidSubscription: any;
  appendListOfShippingsByStoreUidSubscription: any;

  constructor(
      private ngZone: NgZone,
      private modalController: ModalController,
      private loadingService: LoadingService,
      private storeControllerService: StoreControllerServiceService,
      private globalFunctionService: GlobalfunctionService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveListOfShippingsByStoreUid();
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
      if (this.getListOfShippingsByStoreUidSubscription) {
        this.getListOfShippingsByStoreUidSubscription.unsubscribe();
      }
    });
  }

  closeShippingManagementModal() {
    this.modalController.dismiss();
  }

  retrieveListOfShippingsByStoreUid() {
    this.loadingService.present();
    if (this.getListOfShippingsByStoreUidSubscription) {
      this.getListOfShippingsByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfShippingsByStoreUidSubscription = this.storeControllerService.getShippingsByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfShippingsByStoreUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Shippings, please try again later!', 'warning');
        this.listOfShippingsByStoreUid = [];
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while retrieving list of shippings by storeuid.');
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Shippings, please try again later!', 'warning');
      this.listOfShippingsByStoreUid = [];
      this.loadingService.dismiss();
    });
  }

  async openCreateShippingPlanModal() {
    const modal = await this.modalController.create({
      component: AddShippingModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnedFromCreatingShipping) => {
      if (returnedFromCreatingShipping.data) {
        this.retrieveListOfShippingsByStoreUid();
      }
    });
    return await modal.present();
  }

  async openEditShippingModal(shippingUid: string, allowToModify: boolean) {
    const modal = await this.modalController.create({
      component: EditShippingModalPage,
      componentProps: {
        shippingUid,
        allowToModify
      }
    });
    modal.onDidDismiss().then((returnedFromEditingShipping) => {
      if (returnedFromEditingShipping.data) {
        this.retrieveListOfShippingsByStoreUid();
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
      }
    });
    return await modal.present();
  }

  loadMoreShippings(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfShippingsByStoreUidSubscription = this.storeControllerService.getShippingsByStoreUid(
            this.selectedStoreUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempShipping of resp.data) {
              this.listOfShippingsByStoreUid.push(tempShipping);
            }
          }
          this.referInfiniteScroll.target.complete();
        }, error => {
          console.log('API Error while retrieving list of shipping of current storeuid.');
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfShippingsByStoreUid.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfShippingsByStoreUidSubscription) {
      this.getListOfShippingsByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfShippingsByStoreUidSubscription = this.storeControllerService.getShippingsByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfShippingsByStoreUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.listOfShippingsByStoreUid = [];
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Shippings, please try again later!', 'warning');
      }
      event.target.complete();
    }, error => {
      console.log('API Error while retrieving list of shippings by storeuid.');
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Shippings, please try again later!', 'warning');
      this.listOfShippingsByStoreUid = [];
      event.target.complete();
    });
  }
}
