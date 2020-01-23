import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {InventoryManagementModalPage} from '../inventory-management-modal/inventory-management-modal.page';
import {PromotionManagementModalPage} from '../promotion-management-modal/promotion-management-modal.page';
import {WarrantyManagementModalPage} from '../warranty-management-modal/warranty-management-modal.page';
import {ShippingManagementModalPage} from '../shipping-management-modal/shipping-management-modal.page';
import {VoucherManagementModalPage} from '../voucher-management-modal/voucher-management-modal.page';
import {ViewStoreModalPage} from '../view-store-modal/view-store-modal.page';
import {SalesOrderManagementModalPage} from '../sales-order-management-modal/sales-order-management-modal.page';

@Component({
  selector: 'app-store-inventory-management-modal',
  templateUrl: './store-inventory-management-modal.page.html',
  styleUrls: ['./store-inventory-management-modal.page.scss'],
})

export class StoreInventoryManagementModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedStoreUid: string;

  // Numbers
  selectedStoreId: number;

  constructor(
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
  }

  closeStoreInventoryManagementModal() {
    this.modalController.dismiss();
  }

  async openViewStoreModal() {
      const modal = await this.modalController.create({
        component: ViewStoreModalPage,
        componentProps: {
          selectedStoreUid: this.selectedStoreUid,
          selectedStoreId: this.selectedStoreId
        }
      });
      return await modal.present();
  }

  async openInventoryManagementModal() {
    const modal = await this.modalController.create({
      component: InventoryManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }

  async openVoucherManagementModal() {
    const modal = await this.modalController.create({
      component: VoucherManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }

  async openSalesOrderManagementModal() {
    const modal = await this.modalController.create({
      component: SalesOrderManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }

  async openPromotionManagementModal() {
    const modal = await this.modalController.create({
      component: PromotionManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }

  async openWarrantyManagementModal() {
    const modal = await this.modalController.create({
      component: WarrantyManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }

  async openShippingManagementModal() {
    const modal = await this.modalController.create({
      component: ShippingManagementModalPage,
      componentProps: {
        selectedStoreUid: this.selectedStoreUid,
        selectedStoreId: this.selectedStoreId
      }
    });
    return await modal.present();
  }
}
