import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {Store, StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {EditStoreModalPage} from '../edit-store-modal/edit-store-modal.page';

@Component({
  selector: 'app-view-store-modal',
  templateUrl: './view-store-modal.page.html',
  styleUrls: ['./view-store-modal.page.scss'],
})

export class ViewStoreModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedStoreUid: string;

  // Numbers
  selectedStoreId: number;

  // Booleans
  isLoadingStoreInfo = true;
  companyBelongingsFlag = false;

  // Objects
  selectedStore: Store;

  // Subscriptions
  getSelectedStoreSubscription: any;
  deleteSelectedStoreSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private loadingService: LoadingService,
      private ngZone: NgZone,
      private modalController: ModalController,
      private storeControllerService: StoreControllerServiceService,
      private globalFunctionService: GlobalfunctionService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveSelectedStore();
    });
  }

  retrieveSelectedStore() {
    this.isLoadingStoreInfo = true;
    if (this.getSelectedStoreSubscription) {
      this.getSelectedStoreSubscription.unsubscribe();
    }
    this.getSelectedStoreSubscription = this.storeControllerService.getStoreByUid(
        this.selectedStoreUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.selectedStore = resp.data;
        this.companyBelongingsFlag = resp.data.companyBelongings === 1;
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Store info, please try again later!', 'danger');
        this.closeViewStoreModal();
      }
      this.isLoadingStoreInfo = false;
    }, error => {
      console.log('API Error while retrieving selected store by uid.');
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Store info, please try again later!', 'danger');
      this.closeViewStoreModal();
      this.isLoadingStoreInfo = false;
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
      if (this.getSelectedStoreSubscription) {
        this.getSelectedStoreSubscription.unsubscribe();
      }
      if (this.deleteSelectedStoreSubscription) {
        this.deleteSelectedStoreSubscription.unsubscribe();
      }
    });
  }

  closeViewStoreModal() {
    this.modalController.dismiss();
  }

  async openEditStoreModal() {
    const modal = await this.modalController.create({
      component: EditStoreModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    modal.onDidDismiss().then((returnFromEditingStore) => {
      if (returnFromEditingStore.data) {
        this.retrieveSelectedStore();
      }
    });
    return await modal.present();
  }

  deleteStore() {
    this.globalFunctionService.presentAlertConfirm(
        'WARNING',
        'Are you sure you want to delete the selected Store?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.actuallyDeleteStore()
    );
  }

  actuallyDeleteStore() {
    this.loadingService.present();
    if (this.deleteSelectedStoreSubscription) {
      this.deleteSelectedStoreSubscription.unsubscribe();
    }
    this.deleteSelectedStoreSubscription = this.storeControllerService.deleteStoreByUid(
        this.selectedStoreUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Store has been deleted!', 'success');
        this.closeViewStoreModal();
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete Store, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while deleting the Store');
      console.log(error);
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete Store, please try again later!', 'danger');
      this.ref.detectChanges();
    });
  }
}
