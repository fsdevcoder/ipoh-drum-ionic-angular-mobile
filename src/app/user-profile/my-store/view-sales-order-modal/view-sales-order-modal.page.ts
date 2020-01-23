import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Sale, SaleControllerServiceService, Store} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';

@Component({
  selector: 'app-view-sales-order-modal',
  templateUrl: './view-sales-order-modal.page.html',
  styleUrls: ['./view-sales-order-modal.page.scss'],
})

export class ViewSalesOrderModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedSalesOrderUid: string;

  // Numbers
  selectedSalesOrderId: number;

  // Booleans
  isLoadingSalesOrderInfo = true;

  // Objects
  selectedSalesOrder: Sale;
  storeObject: Store;

  // Subscriptions
  getSalesOrderByUidSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private saleControllerService: SaleControllerServiceService
  ) { }

  ngOnInit() {
    this.ngZone.run(() => {
this.retrieveSalesOrderByUid();
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
      if (this.getSalesOrderByUidSubscription) {
        this.getSalesOrderByUidSubscription.unsubscribe();
      }
    });
  }

  closeViewSalesOrderModal() {
    this.modalController.dismiss();
  }

  retrieveSalesOrderByUid() {
    this.isLoadingSalesOrderInfo = true;
    if (this.getSalesOrderByUidSubscription) {
      this.getSalesOrderByUidSubscription.unsubscribe();
    }
    this.getSalesOrderByUidSubscription = this.saleControllerService.getSaleByUid(
        this.selectedSalesOrderUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.selectedSalesOrder = resp.data;
        this.storeObject = this.selectedSalesOrder.store;
      } else {
        this.selectedSalesOrder = null;
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Sales Order info, please try again later!', 'danger');
        this.closeViewSalesOrderModal();
      }
      this.isLoadingSalesOrderInfo = false;
      this.ref.detectChanges();
    }, error => {
      this.selectedSalesOrder = null;
      this.isLoadingSalesOrderInfo = false;
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Sales Order info, please try again later!', 'danger');
      this.ref.detectChanges();
      this.closeViewSalesOrderModal();
    });
  }
}
