import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Inventory, Store, StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {AddInventoryPage} from '../add-inventory/add-inventory.page';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ViewInventoryModalPage} from '../view-inventory-modal/view-inventory-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
  selector: 'app-inventory-management-modal',
  templateUrl: './inventory-management-modal.page.html',
  styleUrls: ['./inventory-management-modal.page.scss'],
})

export class InventoryManagementModalPage implements OnInit, OnDestroy {

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
  listOfInventoriesFromSelectedStore: Array<Inventory> = [];

  // Objects
  selectedStore: Store;
  referInfiniteScroll: any;

  // Subscriptions
  getListOfInventoriesByStoreUidSubscription: any;
  getSelectedStoreByUidSubscription: any;
  appendListOfInventoriesByStoreUidSubscription: any;

  constructor(
      private ngZone: NgZone,
      private modalController: ModalController,
      private storeControllerService: StoreControllerServiceService,
      private loadingService: LoadingService,
      private globalFunctionService: GlobalfunctionService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
      this.ngZone.run(() => {
        this.getSelectedStoreByUidSubscription = this.storeControllerService.getStoreByUid(
            this.selectedStoreUid
        ).subscribe(resp => {
          if (resp.code === 200) {
            this.selectedStore = resp.data;
          }
        }, error => {
          console.log('API Error while retrieving store by uid');
        });
        this.retrieveListOfInventoriesByStoreUid();
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
      if (this.getListOfInventoriesByStoreUidSubscription) {
        this.getListOfInventoriesByStoreUidSubscription.unsubscribe();
      }
      if (this.appendListOfInventoriesByStoreUidSubscription) {
        this.appendListOfInventoriesByStoreUidSubscription.unsubscribe();
      }
    });
  }

  retrieveListOfInventoriesByStoreUid() {
    this.loadingService.present();
    if (this.getListOfInventoriesByStoreUidSubscription) {
      this.getListOfInventoriesByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfInventoriesByStoreUidSubscription = this.storeControllerService.getInventoriesByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfInventoriesFromSelectedStore = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Inventories, please try again later!', 'warning', 'top');
        this.listOfInventoriesFromSelectedStore = [];
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while retrieving list of inventories by store uid.');
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Inventories, please try again later!', 'warning', 'top');
      this.listOfInventoriesFromSelectedStore = [];
      this.loadingService.dismiss();
    });
  }

  closeInventoryManagementModal() {
    this.modalController.dismiss();
  }

  async openCreateInventoryModal() {
    const modal = await this.modalController.create({
      component: AddInventoryPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnedFromCreatingInventory) => {
      if (returnedFromCreatingInventory.data) {
        this.retrieveListOfInventoriesByStoreUid();
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
      }
    });
    return await modal.present();
  }

  async openViewInventoryModal(selectedInventoryUid, selectedInventoryId) {
    const modal = await this.modalController.create({
      component: ViewInventoryModalPage,
      componentProps: {
        selectedInventoryUid,
        selectedInventoryId,
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId,
      }
    });
    modal.onDidDismiss().then((returnedFromEditingInventory) => {
      if (returnedFromEditingInventory.data) {
        this.retrieveListOfInventoriesByStoreUid();
        if (this.referInfiniteScroll) {
          this.referInfiniteScroll.target.disabled = false;
        }
      }
    });
    return await modal.present();
  }

  loadMoreInventoriesFromSelectedStore(event) {
    this.referInfiniteScroll = event;
    setTimeout(() => {
      if (this.maximumPages > this.currentPageNumber) {
        this.currentPageNumber++;
        this.appendListOfInventoriesByStoreUidSubscription = this.storeControllerService.getInventoriesByStoreUid(
            this.selectedStoreUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const tempInventories of resp.data) {
              this.listOfInventoriesFromSelectedStore.push(tempInventories);
            }
          }
          this.referInfiniteScroll.target.complete();
        }, error => {
          console.log('API Error while retrieving list of inventories of current Store');
          this.referInfiniteScroll.target.complete();
        });
      }
      if (this.totalResult === this.listOfInventoriesFromSelectedStore.length) {
        this.referInfiniteScroll.target.disabled = true;
      }
    }, 500);
  }

  ionRefresh(event) {
    if (this.referInfiniteScroll) {
      this.referInfiniteScroll.target.disabled = false;
    }
    if (this.getListOfInventoriesByStoreUidSubscription) {
      this.getListOfInventoriesByStoreUidSubscription.unsubscribe();
    }
    this.currentPageNumber = 1;
    this.getListOfInventoriesByStoreUidSubscription = this.storeControllerService.getInventoriesByStoreUid(
        this.selectedStoreUid,
        this.currentPageNumber,
        this.currentPageSize
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.listOfInventoriesFromSelectedStore = resp.data;
        this.maximumPages = resp.maximumPages;
        this.totalResult = resp.totalResult;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Inventories, please try again later!', 'warning', 'top');
        this.listOfInventoriesFromSelectedStore = [];
      }
      event.target.complete();
    }, error => {
      console.log('API Error while retrieving list of inventories by store uid.');
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Inventories, please try again later!', 'warning', 'top');
      this.listOfInventoriesFromSelectedStore = [];
      event.target.complete();
    });
  }
}
