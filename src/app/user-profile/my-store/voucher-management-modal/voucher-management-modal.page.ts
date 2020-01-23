import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {StoreControllerServiceService, Voucher, VoucherControllerServiceService} from '../../../_dal/ipohdrum';
import {AddVoucherModalPage} from './add-voucher-modal/add-voucher-modal.page';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {EditVoucherModalPage} from './edit-voucher-modal/edit-voucher-modal.page';

@Component({
  selector: 'app-voucher-management-modal',
  templateUrl: './voucher-management-modal.page.html',
  styleUrls: ['./voucher-management-modal.page.scss'],
})

export class VoucherManagementModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedStoreUid: string;

  // Number
  selectedStoreId: number;
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  totalResult: number;

  // Arrays
  listOfVouchersByStoreUid: Array<Voucher> = [];

  // Objects
  referInfiniteScroll: any;

  // Subscriptions
  getListOfVouchersByStoreUidSubscription: any;
  appendListOfVouchersByStoreUidSubscription: any;

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
        this.retrieveListOfVouchersByStoreUid();
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
      if (this.getListOfVouchersByStoreUidSubscription) {
        this.getListOfVouchersByStoreUidSubscription.unsubscribe();
      }
      if (this.appendListOfVouchersByStoreUidSubscription) {
        this.appendListOfVouchersByStoreUidSubscription.unsubscribe();
      }
    });
  }

  retrieveListOfVouchersByStoreUid() {
    this.loadingService.present();
    if (this.getListOfVouchersByStoreUidSubscription) {
      this.getListOfVouchersByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfVouchersByStoreUidSubscription = this.storeControllerService.getVouchersByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfVouchersByStoreUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Vouchers, please try again later!' , 'warning');
        this.listOfVouchersByStoreUid = [];
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while retrieving list of vouchers of this storeuid.');
      this.listOfVouchersByStoreUid = [];
      this.loadingService.dismiss();
    });
  }

  closeVoucherManagementModal() {
    this.modalController.dismiss();
  }

  async openAddVoucherModal() {
    const modal = await this.modalController.create({
      component: AddVoucherModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnedFromCreatingVoucher) => {
      if (returnedFromCreatingVoucher.data) {
        this.retrieveListOfVouchersByStoreUid();
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
      }
    });
    return await modal.present();
  }

  async openEditVoucherModal(voucherUid: string) {
    const modal = await this.modalController.create({
      component: EditVoucherModalPage,
      componentProps: {
        voucherUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnedFromEditingVoucher) => {
      if (returnedFromEditingVoucher.data) {
        this.retrieveListOfVouchersByStoreUid();
      }
    });
    return await modal.present();
  }

  loadMoreVouchers(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfVouchersByStoreUidSubscription = this.storeControllerService.getVouchersByStoreUid(
            this.selectedStoreUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempVouchers of resp.data) {
              this.listOfVouchersByStoreUid.push(tempVouchers);
            }
          }
          this.referInfiniteScroll.target.complete();
        }, error => {
          console.log('API Error while retrieving list of Vouchers of current storeuid.');
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfVouchersByStoreUid.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfVouchersByStoreUidSubscription) {
      this.getListOfVouchersByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfVouchersByStoreUidSubscription = this.storeControllerService.getVouchersByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfVouchersByStoreUid = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Vouchers, please try again later!' , 'warning');
        this.listOfVouchersByStoreUid = [];
      }
      event.target.complete();
    }, error => {
      console.log('API Error while retrieving list of vouchers of this storeuid.');
      this.listOfVouchersByStoreUid = [];
      event.target.complete();
    });
  }
}
