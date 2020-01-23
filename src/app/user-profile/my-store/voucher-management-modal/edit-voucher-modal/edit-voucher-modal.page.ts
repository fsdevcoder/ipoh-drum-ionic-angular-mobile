import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {Voucher, VoucherControllerServiceService} from '../../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
  selector: 'app-edit-voucher-modal',
  templateUrl: './edit-voucher-modal.page.html',
  styleUrls: ['./edit-voucher-modal.page.scss'],
})

export class EditVoucherModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  voucherUid: string;
  selectedStoreId: number;

  // Regex
  priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
  numericOnlyRegex = commonConfig.numericOnlyRegex;
  percentageRegex = commonConfig.percentageRegex;

  // Booleans
  isLoadingVoucher = true;

  // NgModels
  voucherDiscountedByPriceFlagModel = true;
  voucherUnlimitedVoucherFlagModel = true;
  voucherStartDateModel = new Date().toISOString();
  voucherEndDateModel = new Date().toISOString();

  // Numbers
  voucherNameMinLength = 2;
  voucherNameMaxLength = 15;
  voucherDescriptionMinLength = 10;
  voucherDescriptionMaxLength = 300;
  voucherLimitedQuantityMaxLength = 5;
  maxPercentageValue = 100;

  // Objects
  selectedVoucher: Voucher;

  // FormGroups
  storeVoucherFormGroup: FormGroup;

  // Subscriptions
  getCurrentVoucherSubscription: any;
  updateCurrentVoucherSubscription: any;
  deleteCurrentVoucherSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private globalFunctionService: GlobalfunctionService,
      private loadingService: LoadingService,
      private voucherControllerService: VoucherControllerServiceService,
      private modalController: ModalController
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

      this.getCurrentVoucherByVoucherUid();
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
      if (this.getCurrentVoucherSubscription) {
        this.getCurrentVoucherSubscription.unsubscribe();
      }
    });
  }

  closeEditVoucherModal(returnFromEditingVoucher: boolean) {
    this.modalController.dismiss(returnFromEditingVoucher);
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

  getCurrentVoucherByVoucherUid() {
    this.isLoadingVoucher = true;
    this.loadingService.present();
    if (this.getCurrentVoucherSubscription) {
      this.getCurrentVoucherSubscription.unsubscribe();
    }
    this.getCurrentVoucherSubscription = this.voucherControllerService.getVoucherByUid(
        this.voucherUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedVoucher = resp.data;
        // tslint:disable-next-line:max-line-length
        this.selectedVoucher.discbyprice === 1 ? this.voucherDiscountedByPriceFlagModel = true : this.voucherDiscountedByPriceFlagModel = false;
        this.selectedVoucher.unlimited === 1 ? this.voucherUnlimitedVoucherFlagModel = true : this.voucherUnlimitedVoucherFlagModel = false;
        this.voucherStartDateModel = this.selectedVoucher.startdate;
        this.voucherEndDateModel = this.selectedVoucher.enddate;
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the Voucher info, please try again later!', 'danger');
        this.closeEditVoucherModal(false);
      }
      this.loadingService.dismiss();
      this.isLoadingVoucher = false;
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving voucher by uid.');
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the Voucher info, please try again later!', 'danger');
      this.closeEditVoucherModal(false);
      this.loadingService.dismiss();
      this.isLoadingVoucher = false;
      this.ref.detectChanges();
    });
  }

  toggleDiscountByPriceFlag() {
    this.enableDisableDiscountedPriceAndPercentage();
  }

  enableDisableDiscountedPriceAndPercentage() {
    if (this.voucherDiscountedByPriceFlagModel) {
      this.storeVoucherFormGroup.controls.voucherDiscountedPrice.setValidators([
        Validators.required, Validators.pattern(this.priceRegex)
      ]);
      this.storeVoucherFormGroup.get('voucherDiscountedPrice').enable();
      this.storeVoucherFormGroup.get('voucherDiscountedPercentage').disable();
      this.storeVoucherFormGroup.get('voucherDiscountedPercentage').setValue(0.00);
    } else {
      this.storeVoucherFormGroup.controls.voucherDiscountedPercentage.setValidators([
        Validators.required, Validators.pattern(this.percentageRegex), Validators.max(this.maxPercentageValue), Validators.min(0)
      ]);
      this.storeVoucherFormGroup.get('voucherDiscountedPrice').disable();
      this.storeVoucherFormGroup.get('voucherDiscountedPercentage').enable();
      this.storeVoucherFormGroup.get('voucherDiscountedPrice').setValue(0.00);
    }
  }

  selectedStartDate(event) {
    this.voucherStartDateModel = event.detail.value;
  }

  selectedEndDate(event) {
    this.voucherEndDateModel = event.detail.value;
  }

  updateVoucher() {
      if (this.storeVoucherFormGroup.valid) {
        this.loadingService.present();
        this.updateCurrentVoucherSubscription = this.voucherControllerService.updateVoucherByUid(
            this.voucherUid,
            this.selectedStoreId,
            this.selectedVoucher.name,
            this.voucherUnlimitedVoucherFlagModel ? 1 : 0,
            this.voucherDiscountedByPriceFlagModel ? 1 : 0,
            this.selectedVoucher.desc,
            this.selectedVoucher.qty,
            this.selectedVoucher.disc ? this.selectedVoucher.disc : null,
            this.selectedVoucher.discpctg ? this.selectedVoucher.discpctg : null,
            this.selectedVoucher.minpurchase,
            this.selectedVoucher.minqty,
            this.selectedVoucher.minvariety,
            this.voucherStartDateModel.toString().substring(0, 10),
            this.voucherEndDateModel.toString().substring(0, 10)
        ).subscribe(resp => {
          if (resp.code === 200) {
            this.globalFunctionService.simpleToast('SUCCESS', 'The Voucher has been updated!', 'success');
            this.closeEditVoucherModal(true);
          } else {
            this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Voucher, please try again later!', 'danger');
          }
          this.loadingService.dismiss();
        }, error => {
          console.log('API Error while updating Voucher.');
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Voucher, please try again later!', 'danger');
          this.loadingService.dismiss();
        });
      }
  }

  deleteVoucher() {
    this.globalFunctionService.presentAlertConfirm('Warning!',
        'Are you sure you want to delete the Voucher?',
        'Cancel', 'Confirm',
        undefined, () => this.confirmDeleteVoucher());
  }

  confirmDeleteVoucher() {
    this.loadingService.present();
    this.deleteCurrentVoucherSubscription = this.voucherControllerService.deleteVoucherByUid(
        this.voucherUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Voucher has been deleted!', 'success');
        this.closeEditVoucherModal(true);
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Voucher, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while deleting the Voucher, please try again later!');
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Voucher, please try again later!', 'danger');
    });
  }
}
