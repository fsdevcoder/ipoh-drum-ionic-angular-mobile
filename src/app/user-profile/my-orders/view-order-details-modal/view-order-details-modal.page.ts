import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Sale, SaleControllerServiceService, Store} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';

@Component({
  selector: 'app-view-order-details-modal',
  templateUrl: './view-order-details-modal.page.html',
  styleUrls: ['./view-order-details-modal.page.scss'],
})

export class ViewOrderDetailsModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedOrderUid: string;
  inventoryName: string;
  inventoryFamilyName: string;
  inventoryPatternName: string;

  // Numbers
  selectedOrderId: number;

  // Booleans
  isLoadingOrderInfo = true;

  // Objects
  selectedUserOrder: Sale;
  storeObject: Store;

  // Subscriptions
  getUserOrderByOrderUidSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private saleControllerService: SaleControllerServiceService
  ) {}

  ngOnInit() {
    this.ngZone.run(() => {
      this.retrieveUserOrderByOrderUid();
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
      if (this.getUserOrderByOrderUidSubscription) {
        this.getUserOrderByOrderUidSubscription.unsubscribe();
      }
    });
  }

  closeViewOrderDetailsModal() {
    this.modalController.dismiss();
  }

  retrieveUserOrderByOrderUid() {
    this.isLoadingOrderInfo = true;
    if (this.getUserOrderByOrderUidSubscription) {
      this.getUserOrderByOrderUidSubscription.unsubscribe();
    }
    this.getUserOrderByOrderUidSubscription = this.saleControllerService.getSaleByUid(
        this.selectedOrderUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.selectedUserOrder = resp.data;
        this.storeObject = this.selectedUserOrder.store;
      } else {
        this.selectedUserOrder = null;
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Order info, please try again later!', 'danger');
        this.closeViewOrderDetailsModal();
      }
      this.isLoadingOrderInfo = false;
      this.ref.detectChanges();
    }, error => {
      this.selectedUserOrder = null;
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Order info, please try again later!', 'danger');
      this.closeViewOrderDetailsModal();
      this.isLoadingOrderInfo = false;
      this.ref.detectChanges();
    });
  }
}
