import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ProductPromotionControllerServiceService, StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {AddPromotionModalPage} from './add-promotion-modal/add-promotion-modal.page';
import {EditPromotionModalPage} from './edit-promotion-modal/edit-promotion-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
  selector: 'app-promotion-management-modal',
  templateUrl: './promotion-management-modal.page.html',
  styleUrls: ['./promotion-management-modal.page.scss'],
})

export class PromotionManagementModalPage implements OnInit, OnDestroy {

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
  listOfProductPromotions: Array<any> = [];

  // Objects
  referInfiniteScroll: any;

  // Subscriptions
  getListOfProductPromotionsByStoreUidSubscription: any;
  appendListOfProductPromotionByStoreUidSubscription: any;

  constructor(
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private productPromotionControllerService: ProductPromotionControllerServiceService,
      private storeControllerService: StoreControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveListOfProductPromotionsByStoreUid();
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
      if (this.getListOfProductPromotionsByStoreUidSubscription) {
        this.getListOfProductPromotionsByStoreUidSubscription.unsubscribe();
      }
      if (this.appendListOfProductPromotionByStoreUidSubscription) {
        this.appendListOfProductPromotionByStoreUidSubscription.unsubscribe();
      }
    });
  }

  retrieveListOfProductPromotionsByStoreUid() {
    this.loadingService.present();
    if (this.getListOfProductPromotionsByStoreUidSubscription) {
      this.getListOfProductPromotionsByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfProductPromotionsByStoreUidSubscription = this.storeControllerService.getPromotionsByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfProductPromotions = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Promotion Plans, please try again later!', 'warning');
        this.listOfProductPromotions = [];
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while retrieving list of productpromotion by store uid.');
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Promotion Plans, please try again later!', 'warning');
      this.listOfProductPromotions = [];
    });
  }

  closePromotionManagementModal() {
    this.modalController.dismiss();
  }

  async openCreatePromotionPlanModal() {
    const modal = await this.modalController.create({
      component: AddPromotionModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnedFromCreatingPromo) => {
      if (returnedFromCreatingPromo.data) {
        this.currentPageNumber = 1;
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
        this.retrieveListOfProductPromotionsByStoreUid();
      }
    });
    return await modal.present();
  }

  loadMoreProductPromotions(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfProductPromotionByStoreUidSubscription = this.storeControllerService.getPromotionsByStoreUid(
            this.selectedStoreUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempPromo of resp.data) {
              this.listOfProductPromotions.push(tempPromo);
            }
          }
          this.referInfiniteScroll.target.complete();
        }, error => {
          console.log('API Error while retrieving list of promos of current storeuid.');
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfProductPromotions.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }

  async openEditPromotionPlanModal(promoUid: string, allowToModify: boolean) {
    const modal = await this.modalController.create({
      component: EditPromotionModalPage,
      componentProps: {
          promoUid,
          allowToModify
      }
    });
    modal.onDidDismiss().then((returnedFromEditingPromo) => {
      if (returnedFromEditingPromo.data) {
        this.retrieveListOfProductPromotionsByStoreUid();
      }
    });
    return await modal.present();
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfProductPromotionsByStoreUidSubscription) {
      this.getListOfProductPromotionsByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfProductPromotionsByStoreUidSubscription = this.storeControllerService.getPromotionsByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfProductPromotions = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Promotion Plans, please try again later!', 'warning');
        this.listOfProductPromotions = [];
      }
      event.target.complete();
    }, error => {
      console.log('API Error while retrieving list of productpromotion by store uid.');
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Promotion Plans, please try again later!', 'warning');
      this.listOfProductPromotions = [];
      event.target.complete();
    });
  }
}
