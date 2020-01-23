import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {
    InventoryControllerServiceService,
    ProductPromotion, ProductPromotionControllerServiceService,
    Shipping, ShippingControllerServiceService,
    StoreControllerServiceService,
    Warranty, WarrantyControllerServiceService
} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {InvFamilyPatternModalPage} from './inv-family-pattern-modal/inv-family-pattern-modal.page';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
    selector: 'app-add-inventory',
    templateUrl: './add-inventory.page.html',
    styleUrls: ['./add-inventory.page.scss'],
})

export class AddInventoryPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    defaultNoPlanSelectedStr = 'Default (None)';
    selectedStoreUid: string;

    // NgModels
    inventoryNameModel: string;
    inventoryCodeModel: string;
    inventorySKUModel: string;
    inventoryDescriptionModel: string;
    inventoryCostModel: number;
    inventoryBasePriceModel: number;
    inventoryStockThresholdModel: number;

    // Regex
    priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
    numericOnlyRegex = commonConfig.numericOnlyRegex;

    // Number
    selectedStoreId: number;
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
    maxInventoryPhotoSlider = 5;

    // Ionic selectable numbers
    currentPageSize = commonConfig.currentPageSize;

    currentPromotionPageNumber = 1;
    promotionMaxPages: number;

    currentWarrantyPageNumber = 1;
    warrantyMaxPages: number;

    currentShippingPageNumber = 1;
    shippingMaxPages: number;

    // Booleans
    showFirstPage = true;
    showSecondPage = false;
    showThirdPage = false;
    isLoadingPromotionInfo = true;
    isLoadingWarrantyInfo = true;
    isLoadingShippingInfo = true;

    // ViewChild
    @ViewChild('inventoryThumbnailContainer', {static: false}) inventoryThumbnailContainer: ElementRef;
    @ViewChild('inventorySlidersContainer', {static: false}) inventorySlidersContainer: ElementRef;

    // Arrays
    inventoryFamilyAndOrPatternsToInsert: Array<object> = [];
    listOfStorePromotions: ProductPromotion [] = [];
    listOfStoreWarranties: Warranty[] = [];
    listOfStoreShippings: Shipping[] = [];
    inventoryThumbnailAsArray: Array<Blob> = [];
    temporaryInventorySliders: Array<Blob> = [];
    inventorySlidersAsArray: Array<Blob> = [];

    // Objects
    inventoryImageSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400
    };
    defaultSelection = {
        id: null,
        desc: null,
        name: this.defaultNoPlanSelectedStr
    };
    selectedPromotionPlan: ProductPromotion = this.defaultSelection;
    selectedWarrantyPlan: Warranty = this.defaultSelection;
    selectedShippingPlan: Shipping = this.defaultSelection;
    temporaryInventoryThumbnail: Blob;

    // FormGroups
    inventoryInfoFormGroup: FormGroup;

    // Subscriptions
    storePromotionsSubscription: any;
    storeWarrantySubscription: any;
    storeShippingSubscription: any;
    createInventorySubscription: any;
    searchListOfWarrantiesSubscription: any;
    appendListOfWarrantiesSubscription: any;
    searchListOfPromotionsSubscription: any;
    appendListOfPromotionsSubscription: any;
    searchListOfShippingsSubscription: any;
    appendListOfShippingsSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private router: Router,
        private storeControllerService: StoreControllerServiceService,
        private globalFunctionService: GlobalfunctionService,
        private inventoryControllerService: InventoryControllerServiceService,
        private modalController: ModalController,
        private loadingService: LoadingService,
        private productPromotionControllerService: ProductPromotionControllerServiceService,
        private warrantyControllerService: WarrantyControllerServiceService,
        private shippingControllerService: ShippingControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveListOfPromotions();
            this.retrieveListOfWarranties();
            this.retrieveListOfShippings();
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
            if (this.storePromotionsSubscription) {
                this.storePromotionsSubscription.unsubscribe();
            }
            if (this.storeWarrantySubscription) {
                this.storeWarrantySubscription.unsubscribe();
            }
            if (this.storeShippingSubscription) {
                this.storeShippingSubscription.unsubscribe();
            }
            if (this.createInventorySubscription) {
                this.createInventorySubscription.unsubscribe();
            }
            if (this.searchListOfWarrantiesSubscription) {
                this.searchListOfWarrantiesSubscription.unsubscribe();
            }
            if (this.appendListOfWarrantiesSubscription) {
                this.appendListOfWarrantiesSubscription.unsubscribe();
            }
            if (this.searchListOfPromotionsSubscription) {
                this.searchListOfPromotionsSubscription.unsubscribe();
            }
            if (this.appendListOfPromotionsSubscription) {
                this.appendListOfPromotionsSubscription.unsubscribe();
            }
            if (this.searchListOfShippingsSubscription) {
                this.searchListOfShippingsSubscription.unsubscribe();
            }
            if (this.appendListOfShippingsSubscription) {
                this.appendListOfShippingsSubscription.unsubscribe();
            }
        });
    }

    retrieveListOfPromotions() {
        this.isLoadingPromotionInfo = true;
        if (this.storePromotionsSubscription) {
            this.storePromotionsSubscription.unsubscribe();
        }
        this.storePromotionsSubscription = this.productPromotionControllerService.filterProductPromotions(
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
    }

    retrieveListOfWarranties() {
        this.isLoadingWarrantyInfo = true;
        if (this.storeWarrantySubscription) {
            this.storeWarrantySubscription.unsubscribe();
        }
        this.storeWarrantySubscription = this.warrantyControllerService.filterWarranties(
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
    }

    retrieveListOfShippings() {
        this.isLoadingShippingInfo = true;
        if (this.storeShippingSubscription) {
            this.storeShippingSubscription.unsubscribe();
        }
        this.storeShippingSubscription = this.shippingControllerService.filterShippings(
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
    }

    createInventory() {
        if (this.inventoryInfoFormGroup.valid
            && this.temporaryInventorySliders.length > 0
            && this.temporaryInventoryThumbnail !== undefined
            && this.temporaryInventoryThumbnail !== null
            && this.inventoryFamilyAndOrPatternsToInsert.length > 0
        ) {
            this.loadingService.present();
            this.createInventorySubscription = this.inventoryControllerService.createInventory(
                this.inventoryNameModel,
                this.selectedStoreId,
                JSON.stringify(this.inventoryFamilyAndOrPatternsToInsert),
                this.inventoryCostModel,
                this.inventoryBasePriceModel,
                this.selectedPromotionPlan ? this.selectedPromotionPlan.id : null,
                this.selectedWarrantyPlan ? this.selectedWarrantyPlan.id : null,
                this.selectedShippingPlan ? this.selectedShippingPlan.id : null,
                this.inventoryCodeModel,
                this.inventorySKUModel,
                this.inventoryDescriptionModel,
                this.inventoryStockThresholdModel,
                this.inventoryThumbnailAsArray,
                this.inventorySlidersAsArray
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'Inventory has been successfully created!', 'success', 'top');
                    this.closeCreateInventoryModal(true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Inventory, please try again later!', 'warning', 'top');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API error while creating new inventory');
                this.loadingService.dismiss();
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Inventory, please try again later!', 'warning', 'top');
            });
        }
    }

    openSlidersFilePicker() {
        this.inventorySlidersContainer.nativeElement.click();
    }

    uploadInventorySliders(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            // tslint:disable-next-line:max-line-length
            if (this.temporaryInventorySliders.length < this.maxInventoryPhotoSlider && (files.length + this.temporaryInventorySliders.length <= this.maxInventoryPhotoSlider)) {
                if (files) {
                    for (const file of files) {
                        if (file.type.toString().includes('image')) {
                            this.inventorySlidersAsArray.push(file);
                            const reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.temporaryInventorySliders.push(e.target.result);
                                this.loadingService.dismiss();
                            };
                            reader.readAsDataURL(file);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.globalFunctionService.simpleToast('ERROR!', 'Invalid file selected! Please select .jpeg, .jpg or .png files.', 'danger');
                            this.loadingService.dismiss();
                            break;
                        }
                    }
                } else {
                    this.loadingService.dismiss();
                }
            } else {
                this.globalFunctionService.simpleToast('WARNING', 'You have reached the max number of uploaded photos!', 'warning', 'top');
                this.loadingService.dismiss();
            }
        }, 500);
    }

    openThumbnailFilePicker() {
        this.inventoryThumbnailContainer.nativeElement.click();
    }

    uploadInventoryThumbnail(event) {
        const files = event.target.files;
        if (files.length > 0) {
            if (files[0].type.toString().includes('image')) {
                // Actual Blob File
                this.inventoryThumbnailAsArray[0] = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    // Some URL for displaying purpose only
                    this.temporaryInventoryThumbnail = e.target.result;
                };
                reader.readAsDataURL(files[0]);
            }
        }
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
        this.inventoryFamilyAndOrPatternsToInsert.splice(index, 1);
    }

    resetSelectedInventoryImages() {
        this.globalFunctionService.presentAlertConfirm(
            'Warning',
            'Are you sure you want to reset the uploaded Inventory Images?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.resetInventoryImages());
    }

    resetInventoryImages() {
        this.temporaryInventorySliders = [];
        this.inventorySlidersAsArray = [];
    }

    async openAddInventoryFamilyAndPatternModal() {
        const modal = await this.modalController.create({
            component: InvFamilyPatternModalPage
        });
        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data !== undefined && dataReturned.data !== null) {
                this.inventoryFamilyAndOrPatternsToInsert.push(dataReturned.data);
            }
        });
        return await modal.present();
    }

    closeCreateInventoryModal(returnFromCreatingInventory: boolean) {
        this.modalController.dismiss(returnFromCreatingInventory);
    }

    showWhichPage(pageNum: number) {
        switch (pageNum) {
            case 1:
                this.showFirstPage = true;
                this.showSecondPage = false;
                this.showThirdPage = false;
                break;
            case 2:
                this.showFirstPage = false;
                this.showSecondPage = true;
                this.showThirdPage = false;
                break;
            case 3:
                this.showFirstPage = false;
                this.showSecondPage = false;
                this.showThirdPage = true;
                break;
        }
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
                this.retrieveMoreWarranties(event);
                this.ref.detectChanges();
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
                    console.log(this.listOfStoreWarranties);
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

    filterIonicSelectables(objectList: any[], text: string) {
        return objectList.filter(anyObj => {
            return anyObj.name.toLowerCase().indexOf(text) !== -1;
        });
    }
}
