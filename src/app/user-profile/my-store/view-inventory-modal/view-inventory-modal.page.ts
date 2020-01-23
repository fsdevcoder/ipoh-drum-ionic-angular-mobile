import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Inventory, InventoryControllerServiceService, InventoryImageControllerServiceService} from '../../../_dal/ipohdrum';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {InventoryDetailsModalPage} from '../inventory-details-modal/inventory-details-modal.page';
import {ViewInventoryFamiliesPatternModalPage} from '../view-inventory-families-pattern-modal/view-inventory-families-pattern-modal.page';

@Component({
    selector: 'app-view-inventory-modal',
    templateUrl: './view-inventory-modal.page.html',
    styleUrls: ['./view-inventory-modal.page.scss'],
})

export class ViewInventoryModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedInventoryUid: string;
    selectedStoreUid: string;

    // Numbers
    selectedStoreId: number;
    selectedInventoryId: number;

    // Booleans
    isLoadingInventoryInfo = true;

    // Objects
    selectedInventory: Inventory;
    ionSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400
    };
    temporaryInventoryThumbnail: Blob;

    // ViewChild
    @ViewChild('inventoryThumbnailContainer', {static: false}) inventoryThumbnailContainer: ElementRef;
    @ViewChild('inventorySlidersContainer', {static: false}) inventorySlidersContainer: ElementRef;

    // Arrays
    inventoryThumbnailAsArray: Array<Blob> = [];

    // Subscriptions
    getSelectedInventorySubscription: any;
    uploadThumbnailSubscription: any;
    uploadSlidersSubscription: any;
    removeSliderSubscription: any;
    deleteInventorySubscription: any;

    constructor(
        private ngZone: NgZone,
        private inventoryControllerService: InventoryControllerServiceService,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private inventoryImageControllerService: InventoryImageControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            console.log(this.selectedInventoryUid);
            this.retrieveSelectedInventory();
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
            if (this.getSelectedInventorySubscription) {
                this.getSelectedInventorySubscription.unsubscribe();
            }
            if (this.uploadThumbnailSubscription) {
                this.uploadThumbnailSubscription.unsubscribe();
            }
            if (this.removeSliderSubscription) {
                this.removeSliderSubscription.unsubscribe();
            }
            if (this.deleteInventorySubscription) {
                this.deleteInventorySubscription.unsubscribe();
            }
            if (this.uploadSlidersSubscription) {
                this.uploadSlidersSubscription.unsubscribe();
            }
        });
    }

    closeViewInventoryModal(returnFromEditingInventory: boolean) {
        this.modalController.dismiss(returnFromEditingInventory);
    }

    async openEditInventoryModal() {
        const modal = await this.modalController.create({
            component: InventoryDetailsModalPage,
            componentProps: {
                selectedInventoryUid: this.selectedInventoryUid,
                selectedStoreUid: this.selectedStoreUid,
                selectedStoreId: this.selectedStoreId
            }
        });
        modal.onDidDismiss().then((returnFromEditingInventory) => {
            if (returnFromEditingInventory.data) {
                this.retrieveSelectedInventory();
            }
        });
        return await modal.present();
    }

    retrieveSelectedInventory() {
        this.isLoadingInventoryInfo = true;
        if (this.getSelectedInventorySubscription) {
            this.getSelectedInventorySubscription.unsubscribe();
        }
        this.getSelectedInventorySubscription = this.inventoryControllerService.getInventoryByUid(
            this.selectedInventoryUid
        ).subscribe(resp => {
            if (resp.code === 200) {
                console.log(resp);
                this.selectedInventory = resp.data;
            } else {
                this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Inventory info, please try again later!', 'danger');
                this.closeViewInventoryModal(false);
            }
            this.isLoadingInventoryInfo = false;
        }, error => {
            console.log('API Error while retrieving selected inventory by uid.');
            this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Inventory info, please try again later!', 'danger');
            this.closeViewInventoryModal(false);
            this.isLoadingInventoryInfo = false;
        });
    }

    openThumbnailFilePicker() {
        this.inventoryThumbnailContainer.nativeElement.click();
    }

    uploadInventoryThumbnail(event) {
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            if (files.length > 0) {
                if (files[0].type.toString().includes('image')) {
                    this.inventoryThumbnailAsArray[0] = event.target.files[0];
                    this.uploadThumbnailSubscription = this.inventoryControllerService.uploadInventoryThumbnail(
                        this.selectedInventoryId,
                        this.inventoryThumbnailAsArray
                    ).subscribe(resp => {
                        if (resp.code === 200) {
                            this.globalFunctionService.simpleToast('SUCCESS', 'The thumbnail has been updated!', 'success');
                            this.retrieveSelectedInventory();
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.globalFunctionService.simpleToast('WARNING', 'Unable to update the thumbnail, please try again later!', 'warning');
                        }
                        this.loadingService.dismiss();
                    }, error => {
                        console.log('API Error while uploading inventory thumbnail by uid.');
                        // tslint:disable-next-line:max-line-length
                        this.globalFunctionService.simpleToast('WARNING', 'Unable to update the thumbnail, please try again later!', 'warning');
                        console.log(error);
                        this.loadingService.dismiss();
                    });
                }
            }
        }, 500);
    }

    openSlidersFilePicker() {
        this.inventorySlidersContainer.nativeElement.click();
    }

    uploadInventorySliders(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            if (files.length > 0) {
                if (files[0].type.toString().includes('image')) {
                    this.inventoryThumbnailAsArray[0] = event.target.files[0];
                    this.uploadSlidersSubscription = this.inventoryImageControllerService.createInventoryImage(
                        this.selectedInventoryId,
                        this.inventoryThumbnailAsArray
                    ).subscribe(resp => {
                        if (resp.code === 200) {
                            this.globalFunctionService.simpleToast('SUCCESS', 'The Sliders has been updated!', 'success');
                            this.retrieveSelectedInventory();
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.globalFunctionService.simpleToast('WARNING', 'Unable to update the Sliders, please try again later!', 'warning');
                        }
                        this.loadingService.dismiss();
                    }, error => {
                        console.log('API Error while uploading inventory Sliders by uid.');
                        // tslint:disable-next-line:max-line-length
                        this.globalFunctionService.simpleToast('WARNING', 'Unable to update the Sliders, please try again later!', 'warning');
                        console.log(error);
                        this.loadingService.dismiss();
                    });
                } else {
                    this.globalFunctionService.simpleToast('ERROR!', 'Invalid file selected! Please select .jpeg, .jpg or .png files.', 'danger');
                    this.loadingService.dismiss();
                }
            } else {
                this.loadingService.dismiss();
            }
        }, 500);
    }

    removeSelectedSliderPhotoPrompt(selectedSliderUid: string) {
        this.globalFunctionService.presentAlertConfirm(
            'WARNING',
            'Are you sure you want to remove the Image?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.removeSelectedSliderPhoto(selectedSliderUid)
        );
    }

    removeSelectedSliderPhoto(selectedSliderUid: string) {
        this.loadingService.present();
        setTimeout(() => {
            if (this.removeSliderSubscription) {
                this.removeSliderSubscription.unsubscribe();
            }
            this.removeSliderSubscription = this.inventoryImageControllerService.deleteInventoryImageByUid(
                selectedSliderUid
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The sliders image has been updated!', 'success');
                    this.retrieveSelectedInventory();
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('WARNING', 'Unable to remove the Slider image, please try again later!', 'warning');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while deleting sliders image.');
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('WARNING', 'Unable to remove the Slider image, please try again later!', 'warning');
            });
        }, 500);
    }

    deleteSelectedInventoryPrompt() {
        this.globalFunctionService.presentAlertConfirm(
            'WARNING',
            'Are you sure you want to delete the Inventory?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.deleteSelectedInventory()
        );
    }

    deleteSelectedInventory() {
        this.loadingService.present();
        setTimeout(() => {
            if (this.deleteInventorySubscription) {
                this.deleteInventorySubscription.unsubscribe();
            }
            this.deleteInventorySubscription = this.inventoryControllerService.deleteInventoryByUid(
                this.selectedInventoryUid
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Inventory has been deleted!', 'success');
                    this.closeViewInventoryModal(true);
                } else {
                    this.globalFunctionService.simpleToast('WARNING', 'Unable to delete the Inventory, please try again later!', 'warning');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while deleting the Inventory by uid.');
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('WARNING', 'Unable to delete the Inventory, please try again later!', 'warning');
            });
        }, 500);
    }

    async openViewInventoryFamiliesAndPatternsModal(invFamilyPattern: any) {
        const modal = await this.modalController.create({
            component: ViewInventoryFamiliesPatternModalPage,
            cssClass: 'inv-family-pattern-modal',
            componentProps: {
                invFamilyPattern
            }
        });
        return await modal.present();
    }
}
