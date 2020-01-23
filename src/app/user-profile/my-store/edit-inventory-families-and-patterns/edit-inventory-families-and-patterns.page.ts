import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {InventoryFamily, Pattern} from '../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
// tslint:disable-next-line:max-line-length
import {AddInventoryPatternModalPage} from '../add-inventory/inv-family-pattern-modal/add-inventory-pattern-modal/add-inventory-pattern-modal.page';
import {EditInventoryPatternsPage} from '../edit-inventory-patterns/edit-inventory-patterns.page';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
    selector: 'app-edit-inventory-families-and-patterns',
    templateUrl: './edit-inventory-families-and-patterns.page.html',
    styleUrls: ['./edit-inventory-families-and-patterns.page.scss'],
})

export class EditInventoryFamiliesAndPatternsPage implements OnInit {

    // Strings
    constructorName = '[' + this.constructor.name + ']';

    // Regex
    priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
    numericOnlyRegex = commonConfig.numericOnlyRegex;

    // Numbers
    inventoryPatternIndexToReplace: number;
    inventoryFamilyNameMaxLength = commonConfig.inventoryFamilyNameMaxLength;
    inventoryFamilyCodeMinLength = commonConfig.inventoryFamilyCodeMinLength;
    inventoryFamilyCodeMaxLength = commonConfig.inventoryFamilyCodeMaxLength;
    inventoryFamilySKUMinLength = commonConfig.inventoryFamilySKUMinLength;
    inventoryFamilySKUMaxLength = commonConfig.inventoryFamilySKUMaxLength;
    inventoryFamilyDescMinLength = commonConfig.inventoryFamilyDescMinLength;
    inventoryFamilyDescMaxLength = commonConfig.inventoryFamilyDescMaxLength;
    inventoryFamilyCostMaxLength = commonConfig.inventoryFamilyCostMaxLength;
    inventoryFamilySellingPriceMaxLength = commonConfig.inventoryFamilySellingPriceMaxLength;
    inventoryFamilyStockQuantityMaxLength = commonConfig.inventoryFamilyStockQuantityMaxLength;

    // Arrays
    inventoryFamiliesAndPatternsToEdit: InventoryFamily;
    referenceInventoryFamiliesAndPatternsToEdit: InventoryFamily;
    tempInventoryPatternsToInsert: Array<Pattern> = [];

    // FormGroups
    inventoryFamilyFormGroup: FormGroup;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.referenceInventoryFamiliesAndPatternsToEdit = Object.assign({}, this.inventoryFamiliesAndPatternsToEdit);
            this.tempInventoryPatternsToInsert = Object.assign([], this.inventoryFamiliesAndPatternsToEdit.patterns);
            this.inventoryFamilyFormGroup = new FormGroup({
                inventoryFamilyName: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.inventoryFamilyNameMaxLength)
                ]),
                inventoryFamilyCode: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.inventoryFamilyCodeMinLength),
                    Validators.maxLength(this.inventoryFamilyCodeMaxLength)
                    // Validators.pattern(this.alphaNumericOnlyRegex)
                ]),
                inventoryFamilySKU: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.inventoryFamilySKUMinLength),
                    Validators.maxLength(this.inventoryFamilySKUMaxLength)
                    // Validators.pattern(this.alphaNumericOnlyRegex)
                ]),
                inventoryFamilyDescription: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.inventoryFamilyDescMinLength),
                    Validators.maxLength(this.inventoryFamilyDescMaxLength)
                ]),
                inventoryFamilyCost: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.inventoryFamilyCostMaxLength),
                    Validators.pattern(this.priceRegex)
                ]),
                inventoryFamilySellingPrice: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.inventoryFamilySellingPriceMaxLength),
                    Validators.pattern(this.priceRegex)
                ]),
                inventoryFamilyStockQuantity: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.inventoryFamilyStockQuantityMaxLength),
                    Validators.pattern(this.numericOnlyRegex)
                ]),
                inventoryFamilyOnSaleFlag: new FormControl()
            });
            this.ref.detectChanges();
        });
    }

    closeEditInventoryFamiliesAndPatternsModal() {
        this.modalController.dismiss();
    }

    closeAndPassEditedInventoryFamiliesAndPatternModal() {
        this.referenceInventoryFamiliesAndPatternsToEdit.patterns = Object.assign([], this.tempInventoryPatternsToInsert);
        this.modalController.dismiss(this.referenceInventoryFamiliesAndPatternsToEdit);
    }

    removeSelectedInventoryPattern(indexOfPattern: number) {
        this.globalFunctionService.presentAlertConfirm(
            'Warning',
            'Are you sure you want to remove the Inventory Pattern?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.removeInventoryPattern(indexOfPattern));
    }

    removeInventoryPattern(index: number) {
        this.tempInventoryPatternsToInsert.splice(index, 1);
    }

    async openAddInventoryPatternModal() {
        const modal = await this.modalController.create({
            component: AddInventoryPatternModalPage,
            cssClass: 'dialog-modal'
        });
        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data !== undefined && dataReturned.data !== null) {
                this.tempInventoryPatternsToInsert.push(dataReturned.data);
            }
        });
        return await modal.present();
    }

    async openEditInventoryPatternsModal(inventoryPatternToEdit: Pattern, inventoryPatternIndex: number) {
        this.inventoryPatternIndexToReplace = inventoryPatternIndex;
        console.log('inv index: ' + this.inventoryPatternIndexToReplace);
        const modal = await this.modalController.create({
            component: EditInventoryPatternsPage,
            componentProps: {
                inventoryPatternToEdit
            }
        });
        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data !== undefined && dataReturned.data !== null) {
                this.tempInventoryPatternsToInsert[this.inventoryPatternIndexToReplace] = dataReturned.data;
            }
            this.ref.detectChanges();
        });
        return await modal.present();
    }
}
