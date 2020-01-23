import {Component, NgZone, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {VoucherControllerServiceService} from '../../../../_dal/ipohdrum';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-add-voucher-modal',
    templateUrl: './add-voucher-modal.page.html',
    styleUrls: ['./add-voucher-modal.page.scss'],
})

export class AddVoucherModalPage implements OnInit {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedStoreUid: string;

    // Regex
    priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
    numericOnlyRegex = commonConfig.numericOnlyRegex;
    percentageRegex = commonConfig.percentageRegex;

    // NgModels
    voucherNameModel: string;
    voucherDescriptionModel: string;
    voucherDiscountByPriceFlagModel = true;
    voucherDiscountedPriceModel: number;
    voucherDiscountedPercentageModel: number;
    voucherUnlimitedVoucherFlagModel = false;
    voucherLimitedQuantityModel: number;
    voucherMinimumPurchasePriceModel: number;
    voucherMinimumPurchaseQuantityModel: number;
    voucherMinimumPurchaseVarietyModel: number;
    voucherStartDateModel = new Date().toISOString();
    voucherEndDateModel = new Date().toISOString();

    // Numbers
    selectedStoreId: number;
    voucherNameMinLength = 2;
    voucherNameMaxLength = 15;
    voucherDescriptionMinLength = 10;
    voucherDescriptionMaxLength = 300;
    voucherLimitedQuantityMaxLength = 5;
    maxPercentageValue = 100;

    // FormGroups
    storeVoucherFormGroup: FormGroup;

    // Subscriptions
    createVoucherSubscription: any;

    constructor(
        private ngZone: NgZone,
        private modalController: ModalController,
        private loadingService: LoadingService,
        private globalFunctionService: GlobalfunctionService,
        private voucherControllerService: VoucherControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.storeVoucherFormGroup = new FormGroup({
                voucherName: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.voucherNameMinLength),
                    Validators.maxLength(this.voucherNameMaxLength)
                ]),
                voucherDescription: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.voucherDescriptionMinLength),
                    Validators.maxLength(this.voucherDescriptionMaxLength)
                ]),
                voucherDiscountByPriceFlag: new FormControl(),
                voucherDiscountedPrice: new FormControl(),
                voucherDiscountedPercentage: new FormControl(),
                voucherUnlimitedVoucherFlag: new FormControl(),
                voucherLimitedQuantity: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.voucherLimitedQuantityMaxLength),
                    Validators.pattern(this.numericOnlyRegex)
                ]),
                voucherMinimumPurchasePrice: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(this.priceRegex)
                ]),
                voucherMinimumPurchaseQuantity: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(this.numericOnlyRegex)
                ]),
                voucherMinimumPurchaseVariety: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(this.numericOnlyRegex)
                ]),
                voucherStartDate: new FormControl(null, [
                    this.validateSelectedDates
                ]),
                voucherEndDate: new FormControl(null, [
                    this.validateSelectedDates
                ])
            });
            this.enableDisableDiscountedPriceAndPercentage();
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
            if (this.createVoucherSubscription) {
                this.createVoucherSubscription.unsubscribe();
            }
        });
    }

    closeCreateVoucherModal(returnFromCreatingVoucher: boolean) {
        this.modalController.dismiss(returnFromCreatingVoucher);
    }

    enableDisableDiscountedPriceAndPercentage() {
        if (this.voucherDiscountByPriceFlagModel) {
            this.storeVoucherFormGroup.controls.voucherDiscountedPrice.setValidators([
                Validators.required, Validators.pattern(this.priceRegex)
            ]);
            this.storeVoucherFormGroup.get('voucherDiscountedPrice').enable();
            this.storeVoucherFormGroup.get('voucherDiscountedPercentage').disable();
            this.storeVoucherFormGroup.get('voucherDiscountedPercentage').reset();
            this.storeVoucherFormGroup.get('voucherDiscountedPrice').reset();
        } else {
            this.storeVoucherFormGroup.controls.voucherDiscountedPercentage.setValidators([
                Validators.required, Validators.pattern(this.percentageRegex), Validators.max(this.maxPercentageValue), Validators.min(0)
            ]);
            this.storeVoucherFormGroup.get('voucherDiscountedPrice').disable();
            this.storeVoucherFormGroup.get('voucherDiscountedPercentage').enable();
            this.storeVoucherFormGroup.get('voucherDiscountedPercentage').reset();
            this.storeVoucherFormGroup.get('voucherDiscountedPrice').reset();
        }
    }

    toggleDiscountByPriceFlag() {
        this.enableDisableDiscountedPriceAndPercentage();
    }

    selectedStartDate(event) {
        this.voucherStartDateModel = event.detail.value;
    }

    selectedEndDate(event) {
        this.voucherEndDateModel = event.detail.value;
    }

    validateSelectedDates = (c: AbstractControl): any => {
        if (!c.parent || !c) {
            return;
        }
        const startDate = c.parent.get('voucherStartDate');
        const endDate = c.parent.get('voucherEndDate');
        if (!startDate || !endDate) {
            return;
        }
        if (startDate.value > endDate.value) {
            this.storeVoucherFormGroup.get('voucherStartDate').setErrors({
                invalidDate: true
            });
            this.storeVoucherFormGroup.get('voucherEndDate').setErrors({
                invalidDate: true
            });
        }
    };

    createVoucher() {
        console.log(this.voucherDiscountedPercentageModel);
        if (this.storeVoucherFormGroup.valid) {
            this.loadingService.present();
            this.createVoucherSubscription = this.voucherControllerService.createVoucher(
                this.selectedStoreId,
                this.voucherNameModel,
                this.voucherUnlimitedVoucherFlagModel ? 1 : 0,
                this.voucherDiscountByPriceFlagModel ? 1 : 0,
                this.voucherDescriptionModel,
                this.voucherLimitedQuantityModel,
                this.voucherDiscountedPriceModel ? this.voucherDiscountedPriceModel : null,
                this.voucherDiscountedPercentageModel ? this.voucherDiscountedPercentageModel : null,
                this.voucherMinimumPurchasePriceModel,
                this.voucherMinimumPurchaseQuantityModel,
                this.voucherMinimumPurchaseVarietyModel,
                this.voucherStartDateModel.toString().substring(0, 10),
                this.voucherEndDateModel.toString().substring(0, 10)
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Voucher has been created!', 'success');
                    this.closeCreateVoucherModal(true);
                } else {
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to create the Voucher, please try again later!', 'danger');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while creating a new Voucher');
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('ERROR', 'Unable to create the Voucher, please try again later!', 'danger');
            });
        }
    }
}
