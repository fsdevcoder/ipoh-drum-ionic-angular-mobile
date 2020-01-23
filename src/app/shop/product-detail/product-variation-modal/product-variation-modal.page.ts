import {Component, NgZone, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SharedService} from '../../../shared.service';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {LoadingService} from '../../../_dal/common/services/loading.service';

@Component({
  selector: 'app-product-variation-modal',
  templateUrl: './product-variation-modal.page.html',
  styleUrls: ['./product-variation-modal.page.scss'],
})

export class ProductVariationModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';

  // Numbers
  quantitiesToAdd = 1;
  nullSelectedInventoryPatternId = commonConfig.nullSelectedInventoryPatternId;
  priceToDisplay: number;

  // Objects
  availableInventoryPatterns: any;
  selectedInventory: any;
  selectedInventoryFamily: any;
  selectedInventoryPattern: any;
  promotionsObject: any;

  constructor(
      private ngZone: NgZone,
      private modalController: ModalController,
      private sharedService: SharedService,
      private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.ngZone.run(() => {
      if (this.selectedInventory.promotion) {
        this.promotionsObject = this.selectedInventory.promotion;
      } else {
        this.promotionsObject = null;
      }
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  addQuantity() {
    if (this.selectedInventory.qty > this.quantitiesToAdd) {
      this.quantitiesToAdd++;
    }
  }

  reduceQuantity() {
    if (this.quantitiesToAdd > 1) {
      this.quantitiesToAdd--;
    }
  }

  selectInventoryFamily(inventoryFamily: any) {
    this.selectedInventoryFamily = inventoryFamily;
    if (this.promotionsObject) {
      if (this.promotionsObject.discbyprice === 1) {
        this.priceToDisplay = inventoryFamily.price - this.promotionsObject.disc;
      } else {
        this.priceToDisplay = inventoryFamily.price - (inventoryFamily.price * (this.promotionsObject.discpctg / 100));
      }
    } else {
      this.priceToDisplay = inventoryFamily.price;
    }
    if (inventoryFamily.patterns.length > 0) {
      this.availableInventoryPatterns = inventoryFamily.patterns;
      this.priceToDisplay = null;
    } else {
      this.availableInventoryPatterns = null;
      this.selectedInventoryPattern = null;
    }
  }

  selectInventoryPattern(patterns: any) {
    this.selectedInventoryPattern = patterns;
    if (this.promotionsObject) {
      if (this.promotionsObject.discbyprice === 1) {
        this.priceToDisplay = patterns.price - this.promotionsObject.disc;
      } else {
        this.priceToDisplay = patterns.price - (patterns.price * (this.promotionsObject.discpctg / 100));
      }
    } else {
      this.priceToDisplay = patterns.price;
    }
  }

  addItemToCart() {
    this.loadingService.present();
    setTimeout(() => {
      this.selectedInventory.quantitiesToAdd = this.quantitiesToAdd;
      this.selectedInventory.selectedInventoryFamily = this.selectedInventoryFamily;
      if (this.selectedInventoryPattern) {
        this.selectedInventory.selectedInventoryPattern = this.selectedInventoryPattern;
      } else {
        this.selectedInventory.selectedInventoryPattern = {
          id: this.nullSelectedInventoryPatternId
        };
      }
      this.sharedService.emitSelectedInventory(this.selectedInventory);
      this.loadingService.dismiss();
      this.closeModal();
    }, 500);
  }
}
