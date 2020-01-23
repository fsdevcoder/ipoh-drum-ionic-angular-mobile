import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  Company,
  Inventory,
  InventoryControllerServiceService, InventoryFamily,
  ProductPromotion, ProductPromotionControllerServiceService,
  Shipping, ShippingControllerServiceService,
  StoreControllerServiceService,
  Warranty, WarrantyControllerServiceService
} from '../../../_dal/ipohdrum';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {InvFamilyPatternModalPage} from '../add-inventory/inv-family-pattern-modal/inv-family-pattern-modal.page';
import {EditInventoryFamiliesAndPatternsPage} from '../edit-inventory-families-and-patterns/edit-inventory-families-and-patterns.page';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-inventory-details-modal',
  templateUrl: './inventory-details-modal.page.html',
  styleUrls: ['./inventory-details-modal.page.scss'],
})

export class InventoryDetailsModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  defaultNoPlanSelectedStr = 'Default (None)';
  selectedInventoryUid: string;
  selectedStoreUid: string;

  // Regex
  priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
  numericOnlyRegex = commonConfig.numericOnlyRegex;

  // Booleans
  isLoadingInventoryDetails = true;
  isLoadingPromotionInfo = true;
  isLoadingWarrantyInfo = true;
  isLoadingShippingInfo = true;

  // Numbers
  inventoryNameMinLength = commonConfig.inventoryNameMinLength;
  inventoryNameMaxLength = commonConfig.inventoryNameMaxLength;
  inventoryCodeMinLength = commonConfig.inventoryCodeMinLength;
  inventoryCodeMaxLength = commonConfig.inventoryCodeMaxLength;
  inventorySKUMinLength = commonConfig.inventorySKUMinLength;
  inventorySKUMaxLength = commonConfig.inventorySKUMaxLength;
  inventoryDescMinLength = commonConfig.inventoryDescMinLength;
  inventoryDescMaxLength = commonConfig.inventoryDescMaxLength;
  inventoryCostMaxLength = commonConfig.inventoryCostMaxLength;
  inventorySellingPriceMaxLength = commonConfig.inventorySellingPriceMaxLength;
  inventoryStockThresholdMaxLength = commonConfig.inventoryStockThresholdMaxLength;
  selectedStoreId: number;

  // Ionic selectable numbers
  currentPageSize = commonConfig.currentPageSize;

  currentPromotionPageNumber = 1;
  promotionMaxPages: number;

  currentWarrantyPageNumber = 1;
  warrantyMaxPages: number;

  currentShippingPageNumber = 1;
  shippingMaxPages: number;

  // Objects
  selectedInventory: Inventory;
  defaultSelection = {
    id: null,
    desc: null,
    name: this.defaultNoPlanSelectedStr
  };
  selectedProductPromotionPlan: ProductPromotion;
  selectedWarrantyPlan: Warranty;
  selectedShippingPlan: Shipping;

  // Arrays
  listOfStorePromotions: ProductPromotion [] = [];
  listOfStoreWarranties: Warranty[] = [];
  listOfStoreShippings: Shipping[] = [];

  // ViewChild
  @ViewChild('inventoryThumbnailContainer', {static: false}) inventoryThumbnailContainer: ElementRef;
  @ViewChild('inventorySlidersContainer', {static: false}) inventorySlidersContainer: ElementRef;

  // FormGroups
  inventoryInfoFormGroup: FormGroup;

  // Subscriptions
  getInventoryDetailsSubscription: any;
  getListOfProductPromotionSubscription: any;
  getListOfWarrantySubscription: any;
  getListOfShippingSubscription: any;
  updateInventorySubscription: any;
  searchListOfWarrantiesSubscription: any;
  appendListOfWarrantiesSubscription: any;
  searchListOfPromotionsSubscription: any;
  appendListOfPromotionsSubscription: any;
  searchListOfShippingsSubscription: any;
  appendListOfShippingsSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private inventoryControllerService: InventoryControllerServiceService,
      private storeControllerService: StoreControllerServiceService,
      private productPromotionControllerService: ProductPromotionControllerServiceService,
      private warrantyControllerService: WarrantyControllerServiceService,
      private shippingControllerService: ShippingControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.inventoryInfoFormGroup = new FormGroup({
        inventoryName: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.inventoryNameMinLength),
          Validators.maxLength(this.inventoryNameMaxLength)
        ]),
        inventoryCode: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.inventoryCodeMinLength),
          Validators.maxLength(this.inventoryCodeMaxLength)
          // Validators.pattern(this.alphaNumericOnlyRegex)
        ]),
        inventorySKU: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.inventorySKUMinLength),
          Validators.maxLength(this.inventorySKUMaxLength)
          // Validators.pattern(this.alphaNumericOnlyRegex)
        ]),
        inventoryDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.inventoryDescMinLength),
          Validators.maxLength(this.inventoryDescMaxLength)
        ]),
        inventoryCost: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryCostMaxLength),
          Validators.pattern(this.priceRegex)
        ]),
        inventoryBasePrice: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventorySellingPriceMaxLength),
          Validators.pattern(this.priceRegex)
        ]),
        inventoryStockThreshold: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryStockThresholdMaxLength),
          Validators.pattern(this.numericOnlyRegex)
        ])
      });
      this.ref.detectChanges();
      this.retrieveSelectedInventoryInfo();
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
      if (this.getInventoryDetailsSubscription) {
        this.getInventoryDetailsSubscription.unsubscribe();
      }
      if (this.getListOfProductPromotionSubscription) {
        this.getListOfProductPromotionSubscription.unsubscribe();
      }
      if (this.getListOfWarrantySubscription) {
        this.getListOfWarrantySubscription.unsubscribe();
      }
      if (this.getListOfShippingSubscription) {
        this.getListOfShippingSubscription.unsubscribe();
      }
      if (this.updateInventorySubscription) {
        this.updateInventorySubscription.unsubscribe();
      }
      if (this.searchListOfPromotionsSubscription) {
        this.searchListOfPromotionsSubscription.unsubscribe();
      }
      if (this.appendListOfPromotionsSubscription) {
        this.appendListOfPromotionsSubscription.unsubscribe();
      }
      if (this.searchListOfWarrantiesSubscription) {
        this.searchListOfWarrantiesSubscription.unsubscribe();
      }
      if (this.appendListOfWarrantiesSubscription) {
        this.appendListOfWarrantiesSubscription.unsubscribe();
      }
      if (this.searchListOfShippingsSubscription) {
        this.searchListOfShippingsSubscription.unsubscribe();
      }
      if (this.appendListOfShippingsSubscription) {
        this.appendListOfShippingsSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedInventoryInfo() {
    this.loadingService.present();
    setTimeout(() => {
      this.isLoadingInventoryDetails = true;
      if (this.getInventoryDetailsSubscription) {
        this.getInventoryDetailsSubscription.unsubscribe();
      }
      this.getInventoryDetailsSubscription = this.inventoryControllerService.getInventoryByUid(
          this.selectedInventoryUid
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.selectedInventory = resp.data;
          this.selectedProductPromotionPlan = this.selectedInventory.promotion;
          this.selectedInventory.promotion ? this.selectedProductPromotionPlan = this.selectedInventory.promotion
              : this.selectedProductPromotionPlan = this.defaultSelection;
          this.selectedInventory.warranty ? this.selectedWarrantyPlan = this.selectedInventory.warranty
              : this.selectedWarrantyPlan = this.defaultSelection;
          this.selectedInventory.shipping ? this.selectedShippingPlan = this.selectedInventory.shipping
              : this.selectedShippingPlan = this.defaultSelection;
        } else {
          // tslint:disable-next-line:max-line-length
          this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Inventory details, please try again later!', 'warning', 'top');
          this.closeInventoryDetailsModal(false);
        }

        // Callbacks
        this.retrieveListOfProductPromotions();
        this.retrieveListOfWarranties();
        this.retrieveListOfShippings();

        this.loadingService.dismiss();
        this.isLoadingInventoryDetails = false;
        this.ref.detectChanges();
      }, error => {
        console.log('API error unable to retrieve inventory details');
        console.log(error);
        this.loadingService.dismiss();
        this.isLoadingInventoryDetails = false;
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Inventory details, please try again later!', 'warning', 'top');
        this.closeInventoryDetailsModal(false);
        this.ref.detectChanges();
      });
    }, 500);
  }

  removeSelectedInventoryFamilyAndOrPattern(index: number) {
    this.globalFunctionService.presentAlertConfirm(
        'Warning',
        'Are you sure you want to remove the Inventory Family & Pattern?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.removeInventoryFamilyAndOrPattern(index));

  }

  removeInventoryFamilyAndOrPattern(index: number) {
    this.selectedInventory.inventoryfamilies.splice(index, 1);
  }

  async openEditInventoryFamiliesAndPatternsModal(inventoryFamiliesAndPatternsToEdit: InventoryFamily) {
    const modal = await this.modalController.create({
      component: EditInventoryFamiliesAndPatternsPage,
      componentProps: {
        inventoryFamiliesAndPatternsToEdit
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== undefined && dataReturned.data !== null) {
        for (let i = 0 ; i < this.selectedInventory.inventoryfamilies.length ; i++) {
          if (this.selectedInventory.inventoryfamilies[i].id === dataReturned.data.id) {
            this.selectedInventory.inventoryfamilies[i] = dataReturned.data;
          }
        }
      }
      this.ref.detectChanges();
    });
    return await modal.present();
  }

  async openAddInventoryFamilyAndPatternModal() {
    const modal = await this.modalController.create({
      component: InvFamilyPatternModalPage
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== undefined && dataReturned.data !== null) {
        this.selectedInventory.inventoryfamilies.push(dataReturned.data);
      }
    });
    return await modal.present();
  }

  closeInventoryDetailsModal(returnFromEditingInventory: boolean) {
    this.modalController.dismiss(returnFromEditingInventory);
  }

  updateInventory() {
    console.log(this.selectedInventory);
    console.log(this.selectedInventory.inventoryfamilies);
    if (this.inventoryInfoFormGroup.valid
        && this.selectedInventory.inventoryfamilies.length > 0) {
      this.loadingService.present();
      this.updateInventorySubscription = this.inventoryControllerService.updateInventoryByUid(
          this.selectedInventoryUid,
          this.selectedInventory.name,
          this.selectedStoreId,
          JSON.stringify(this.selectedInventory.inventoryfamilies),
          this.selectedInventory.cost,
          this.selectedInventory.price,
          this.selectedInventory.qty,
          this.selectedInventory.onsale,
          this.selectedProductPromotionPlan.id,
          this.selectedWarrantyPlan.id,
          this.selectedShippingPlan.id,
          this.selectedInventory.code,
          this.selectedInventory.sku,
          this.selectedInventory.desc,
          this.selectedInventory.stockthreshold
      ).subscribe(resp => {
        console.log(resp);
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'The Inventory has been updated!', 'success');
          this.closeInventoryDetailsModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update Inventory Info, please try again later!', 'danger');
        }
        this.loadingService.dismiss();
      }, error => {
        console.log('API Error while updating Inventory');
        this.loadingService.dismiss();
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update Inventory Info, please try again later!', 'danger');
      });
    }
  }

  retrieveListOfProductPromotions() {
    this.loadingService.present();
    setTimeout(() => {
      this.isLoadingPromotionInfo = true;
      if (this.getListOfProductPromotionSubscription) {
        this.getListOfProductPromotionSubscription.unsubscribe();
      }
      this.getListOfProductPromotionSubscription = this.productPromotionControllerService.filterProductPromotions(
          this.currentPromotionPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStorePromotions.push(this.defaultSelection);
            for (const tempPromo of resp.data) {
              this.listOfStorePromotions.push(tempPromo);
            }
          } else {
            this.listOfStorePromotions = [];
          }
        } else {
          this.listOfStorePromotions = [];
        }
        this.isLoadingPromotionInfo = false;
        this.ref.detectChanges();
      }, error => {
        this.listOfStorePromotions = [];
        this.isLoadingPromotionInfo = false;
        this.ref.detectChanges();
      });
    }, 500);
  }

  searchForPromotions(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (this.searchListOfPromotionsSubscription) {
      this.searchListOfPromotionsSubscription.unsubscribe();
    }
    this.currentPromotionPageNumber = 1;
    if (!text) {
      this.listOfStorePromotions = [];
      if (this.searchListOfPromotionsSubscription) {
        this.searchListOfPromotionsSubscription.unsubscribe();
      }
      this.searchListOfPromotionsSubscription = this.productPromotionControllerService.filterProductPromotions(
          this.currentPromotionPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStorePromotions.push(this.defaultSelection);
            for (const tempPromotion of resp.data) {
              this.listOfStorePromotions.push(tempPromotion);
            }
            this.promotionMaxPages = resp.maximumPages;
          } else {
            this.listOfStorePromotions = [];
            this.promotionMaxPages = 0;
          }
          event.component.items = this.listOfStorePromotions;
        } else {
          this.listOfStorePromotions = [];
          this.promotionMaxPages = 0;
        }
        event.component.endSearch();
        event.component.enableInfiniteScroll();
        this.ref.detectChanges();
        this.retrieveMorePromotions(event);
      }, error => {
        console.log('API error while retrieving list of Product Promotions.');
        console.log(error);
      });
      return;
    }
    this.searchListOfPromotionsSubscription = this.productPromotionControllerService.filterProductPromotions(
        this.currentPromotionPageNumber,
        this.currentPageSize,
        text,
        null,
        null,
        'true',
        this.selectedStoreId
    ).subscribe(resp => {
      if (this.searchListOfPromotionsSubscription.closed) {
        return;
      }
      if (resp.code === 200) {
        if (resp.data) {
          this.listOfStorePromotions = this.filterIonicSelectables(resp.data, text);
        } else {
          this.listOfStorePromotions = [];
        }
      }
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving filtered Product Promotions.');
      console.log(error);
    });
  }

  retrieveMorePromotions(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = (event.text || '').trim().toLowerCase();
    if (this.currentPromotionPageNumber > this.promotionMaxPages) {
      // event.component.disableInfiniteScroll();
      event.component.endInfiniteScroll();
      return;
    } else {
      this.currentPromotionPageNumber++;
      if (text) {
        this.appendListOfPromotionsSubscription = this.productPromotionControllerService.filterProductPromotions(
            this.currentPromotionPageNumber,
            this.currentPageSize,
            text,
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const promotion of resp.data) {
              this.listOfStorePromotions.push(promotion);
            }
          }
          event.component.items = this.listOfStorePromotions;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          event.component.endInfiniteScroll();
        });
      } else {
        this.appendListOfPromotionsSubscription = this.productPromotionControllerService.filterProductPromotions(
            this.currentPromotionPageNumber,
            this.currentPageSize,
            '',
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const promotion of resp.data) {
              this.listOfStorePromotions.push(promotion);
            }
          }
          event.component.items = this.listOfStorePromotions;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          console.log('API error while retrieving list of Product Promotions.');
          console.log(error);
          event.component.endInfiniteScroll();
        });
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////

  retrieveListOfWarranties() {
    this.loadingService.present();
    setTimeout(() => {
      this.isLoadingWarrantyInfo = true;
      if (this.getListOfWarrantySubscription) {
        this.getListOfWarrantySubscription.unsubscribe();
      }
      this.getListOfWarrantySubscription = this.warrantyControllerService.filterWarranties(
          this.currentWarrantyPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStoreWarranties.push(this.defaultSelection);
            for (const tempWarranty of resp.data) {
              this.listOfStoreWarranties.push(tempWarranty);
            }
          } else {
            this.listOfStoreWarranties = [];
          }
        } else {
          this.listOfStoreWarranties = [];
        }
        this.isLoadingWarrantyInfo = false;
        this.ref.detectChanges();
      }, error => {
        this.listOfStoreWarranties = [];
        this.isLoadingWarrantyInfo = false;
        this.ref.detectChanges();
      });
    }, 500);
  }

  filterIonicSelectables(objectList: any[], text: string) {
    return objectList.filter(anyObj => {
      return anyObj.name.toLowerCase().indexOf(text) !== -1;
    });
  }

  searchForWarranties(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (this.searchListOfWarrantiesSubscription) {
      this.searchListOfWarrantiesSubscription.unsubscribe();
    }
    this.currentWarrantyPageNumber = 1;
    if (!text) {
      this.listOfStoreWarranties = [];
      if (this.searchListOfWarrantiesSubscription) {
        this.searchListOfWarrantiesSubscription.unsubscribe();
      }
      this.searchListOfWarrantiesSubscription = this.warrantyControllerService.filterWarranties(
          this.currentWarrantyPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStoreWarranties.push(this.defaultSelection);
            for (const tempWarranty of resp.data) {
              this.listOfStoreWarranties.push(tempWarranty);
            }
            this.warrantyMaxPages = resp.maximumPages;
          } else {
            this.listOfStoreWarranties = [];
            this.warrantyMaxPages = 0;
          }
          event.component.items = this.listOfStoreWarranties;
        } else {
          this.listOfStoreWarranties = [];
          this.warrantyMaxPages = 0;
        }
        event.component.endSearch();
        event.component.enableInfiniteScroll();
        this.ref.detectChanges();
        this.retrieveMoreWarranties(event);
      }, error => {
        console.log('API error while retrieving list of Warranties.');
        console.log(error);
      });
      return;
    }
    this.searchListOfWarrantiesSubscription = this.warrantyControllerService.filterWarranties(
        this.currentWarrantyPageNumber,
        this.currentPageSize,
        text,
        null,
        null,
        'true',
        this.selectedStoreId
    ).subscribe(resp => {
      if (this.searchListOfWarrantiesSubscription.closed) {
        return;
      }
      if (resp.code === 200) {
        if (resp.data) {
          this.listOfStoreWarranties = this.filterIonicSelectables(resp.data, text);
        } else {
          this.listOfStoreWarranties = [];
        }
      }
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving filtered Warranties.');
      console.log(error);
    });
  }

  retrieveMoreWarranties(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = (event.text || '').trim().toLowerCase();
    if (this.currentWarrantyPageNumber > this.warrantyMaxPages) {
      // event.component.disableInfiniteScroll();
      event.component.endInfiniteScroll();
      return;
    } else {
      this.currentWarrantyPageNumber++;
      if (text) {
        this.appendListOfWarrantiesSubscription = this.warrantyControllerService.filterWarranties(
            this.currentWarrantyPageNumber,
            this.currentPageSize,
            text,
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const warranty of resp.data) {
              this.listOfStoreWarranties.push(warranty);
            }
          }
          event.component.items = this.listOfStoreWarranties;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          event.component.endInfiniteScroll();
        });
      } else {
        this.appendListOfWarrantiesSubscription = this.warrantyControllerService.filterWarranties(
            this.currentWarrantyPageNumber,
            this.currentPageSize,
            '',
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const warranty of resp.data) {
              this.listOfStoreWarranties.push(warranty);
            }
          }
          event.component.items = this.listOfStoreWarranties;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          console.log('API error while retrieving list of Warranties.');
          console.log(error);
          event.component.endInfiniteScroll();
        });
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////

  retrieveListOfShippings() {
    this.loadingService.present();
    setTimeout(() => {
      this.isLoadingShippingInfo = true;
      if (this.getListOfShippingSubscription) {
        this.getListOfShippingSubscription.unsubscribe();
      }
      this.getListOfShippingSubscription = this.shippingControllerService.filterShippings(
          this.currentShippingPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStoreShippings.push(this.defaultSelection);
            for (const tempShipping of resp.data) {
              this.listOfStoreShippings.push(tempShipping);
            }
          } else {
            this.listOfStoreShippings = [];
          }
        } else {
          this.listOfStoreShippings = [];
        }
        this.isLoadingShippingInfo = false;
        this.ref.detectChanges();
      }, error => {
        this.listOfStoreShippings = [];
        this.isLoadingShippingInfo = false;
        this.ref.detectChanges();
      });
    }, 500);
  }

  searchForShippings(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();
    if (this.searchListOfShippingsSubscription) {
      this.searchListOfShippingsSubscription.unsubscribe();
    }
    this.currentShippingPageNumber = 1;
    if (!text) {
      this.listOfStoreShippings = [];
      if (this.searchListOfShippingsSubscription) {
        this.searchListOfShippingsSubscription.unsubscribe();
      }
      this.searchListOfShippingsSubscription = this.shippingControllerService.filterShippings(
          this.currentShippingPageNumber,
          this.currentPageSize,
          '',
          null,
          null,
          'true',
          this.selectedStoreId
      ).subscribe(resp => {
        if (resp.code === 200) {
          if (resp.data) {
            this.listOfStoreShippings.push(this.defaultSelection);
            for (const tempShipping of resp.data) {
              this.listOfStoreShippings.push(tempShipping);
            }
            this.shippingMaxPages = resp.maximumPages;
          } else {
            this.listOfStoreShippings = [];
            this.shippingMaxPages = 0;
          }
          event.component.items = this.listOfStoreShippings;
        } else {
          this.listOfStoreShippings = [];
          this.shippingMaxPages = 0;
        }
        event.component.endSearch();
        event.component.enableInfiniteScroll();
        this.ref.detectChanges();
        this.retrieveMoreShippings(event);
      }, error => {
        console.log('API error while retrieving list of Shippings.');
        console.log(error);
      });
      return;
    }
    this.searchListOfShippingsSubscription = this.shippingControllerService.filterShippings(
        this.currentShippingPageNumber,
        this.currentPageSize,
        text,
        null,
        null,
        'true',
        this.selectedStoreId
    ).subscribe(resp => {
      if (this.searchListOfShippingsSubscription.closed) {
        return;
      }
      if (resp.code === 200) {
        if (resp.data) {
          this.listOfStoreShippings = this.filterIonicSelectables(resp.data, text);
        } else {
          this.listOfStoreShippings = [];
        }
      }
      event.component.endSearch();
      event.component.enableInfiniteScroll();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving filtered Shippings.');
      console.log(error);
    });
  }

  retrieveMoreShippings(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = (event.text || '').trim().toLowerCase();
    if (this.currentShippingPageNumber > this.shippingMaxPages) {
      // event.component.disableInfiniteScroll();
      event.component.endInfiniteScroll();
      return;
    } else {
      this.currentShippingPageNumber++;
      if (text) {
        this.appendListOfShippingsSubscription = this.shippingControllerService.filterShippings(
            this.currentShippingPageNumber,
            this.currentPageSize,
            text,
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const shipping of resp.data) {
              this.listOfStoreShippings.push(shipping);
            }
          }
          event.component.items = this.listOfStoreShippings;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          event.component.endInfiniteScroll();
        });
      } else {
        this.appendListOfShippingsSubscription = this.shippingControllerService.filterShippings(
            this.currentShippingPageNumber,
            this.currentPageSize,
            '',
            null,
            null,
            'true',
            this.selectedStoreId
        ).subscribe(resp => {
          if (resp.code === 200) {
            for (const shipping of resp.data) {
              this.listOfStoreShippings.push(shipping);
            }
          }
          event.component.items = this.listOfStoreShippings;
          event.component.endInfiniteScroll();
          this.ref.detectChanges();
        }, error => {
          console.log('API error while retrieving list of Shippings.');
          console.log(error);
          event.component.endInfiniteScroll();
        });
      }
    }
  }
}
