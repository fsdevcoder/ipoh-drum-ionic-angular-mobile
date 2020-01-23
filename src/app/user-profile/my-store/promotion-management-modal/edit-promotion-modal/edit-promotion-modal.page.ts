import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {ProductPromotionControllerServiceService} from '../../../../_dal/ipohdrum';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
  selector: 'app-edit-promotion-modal',
  templateUrl: './edit-promotion-modal.page.html',
  styleUrls: ['./edit-promotion-modal.page.scss'],
})

export class EditPromotionModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  promoUid: string;

  // Regex
  priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
  numericOnlyRegex = commonConfig.numericOnlyRegex;

  // NgModels
  promotionPlanDiscountByPriceFlagModel = true;

  // Booleans
  isLoadingProductPromotion = true;
  allowToModify: boolean;

  // Numbers
  promotionPlanNameMinLength = 2;
  promotionPlanNameMaxLength = 50;
  promotionPlanDescriptionMinLength = 5;
  promotionPlanDescriptionMaxLength = 100;
  promotionPlanLimitedQuantityMaxLength = 5;

  // Objects
  selectedProductPromotion: any;

  // FormGroups
  promotionPlanFormGroup: FormGroup;

  // Subscriptions
  getProductPromotionByUidSubscription: any;
  updateProductPromotionSubscription: any;
  deleteProductPromotionSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private loadingService: LoadingService,
      private productPromotionControllerService: ProductPromotionControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.promotionPlanFormGroup = new FormGroup({
        promotionPlanName: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.promotionPlanNameMinLength),
          Validators.maxLength(this.promotionPlanNameMaxLength)
        ]),
        promotionPlanDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.promotionPlanDescriptionMinLength),
          Validators.maxLength(this.promotionPlanDescriptionMaxLength)
        ]),
        promotionPlanLimitedQuantity: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.promotionPlanLimitedQuantityMaxLength),
          Validators.pattern(this.numericOnlyRegex)
        ]),
        promotionPlanDiscountByPriceFlag: new FormControl(),
        promotionPlanDiscountedPrice: new FormControl(),
        promotionPlanDiscountedPercentage: new FormControl(),
        promotionPlanStartDate: new FormControl(null, [
          this.validateSelectedDates
        ]),
        promotionPlanEndDate: new FormControl(null, [
          this.validateSelectedDates
        ])
      });

      this.enableDisableDiscountedPriceAndPercentage();

      this.loadingService.present();
      this.isLoadingProductPromotion = true;
      this.getProductPromotionByUidSubscription = this.productPromotionControllerService.getProductPromotionByUid(
      this.promoUid
      ).subscribe(resp => {
        console.log(resp);
        if (resp.code === 200) {
          this.selectedProductPromotion = resp.data;
          // tslint:disable-next-line:max-line-length
          this.selectedProductPromotion.discbyprice === 1 ? this.promotionPlanDiscountByPriceFlagModel = true : this.promotionPlanDiscountByPriceFlagModel = false;
        } else {
          this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Promotion Plan, please try again later!', 'warning');
          this.closeEditProductPromotionModal(false);
        }
        this.loadingService.dismiss();
        this.isLoadingProductPromotion = false;
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while retrieving product promotion by uid.');
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Promotion Plan, please try again later!', 'warning');
        this.loadingService.dismiss();
        this.closeEditProductPromotionModal(false);
        this.isLoadingProductPromotion = false;
        this.ref.detectChanges();
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
      if (this.updateProductPromotionSubscription) {
        this.updateProductPromotionSubscription.unsubscribe();
      }
    });
  }

  closeEditProductPromotionModal(returnFromEditPromotion: boolean) {
    this.modalController.dismiss(returnFromEditPromotion);
  }

  validateSelectedDates = (c: AbstractControl): any => {
    if (!c.parent || !c) {
      return;
    }
    const startDate = c.parent.get('promotionPlanStartDate');
    const endDate = c.parent.get('promotionPlanEndDate');
    if (!startDate || !endDate) {
      return;
    }
    if (startDate.value > endDate.value) {
      this.promotionPlanFormGroup.get('promotionPlanStartDate').setErrors({
        invalidDate: true
      });
      this.promotionPlanFormGroup.get('promotionPlanEndDate').setErrors({
        invalidDate: true
      });
    }
  };

  toggleDiscountByPriceFlag() {
    this.enableDisableDiscountedPriceAndPercentage();
  }

  enableDisableDiscountedPriceAndPercentage() {
    if (this.promotionPlanDiscountByPriceFlagModel) {
      this.promotionPlanFormGroup.controls.promotionPlanDiscountedPrice.setValidators([
        Validators.required, Validators.pattern(this.priceRegex)
      ]);
      this.promotionPlanFormGroup.get('promotionPlanDiscountedPrice').enable();
      this.promotionPlanFormGroup.get('promotionPlanDiscountedPercentage').disable();
    } else {
      this.promotionPlanFormGroup.controls.promotionPlanDiscountedPercentage.setValidators([
        Validators.required, Validators.pattern(this.priceRegex)
      ]);
      this.promotionPlanFormGroup.get('promotionPlanDiscountedPrice').disable();
      this.promotionPlanFormGroup.get('promotionPlanDiscountedPercentage').enable();
    }
    this.ref.detectChanges();
  }

  updateProductPromotionPlan() {
    if (this.promotionPlanFormGroup.valid) {
      this.loadingService.present();
      this.updateProductPromotionSubscription = this.productPromotionControllerService.updateProductPromotionByUid(
          this.selectedProductPromotion.uid,
          this.selectedProductPromotion.name,
          this.selectedProductPromotion.store_id,
          this.promotionPlanDiscountByPriceFlagModel === true ? 1 : 0,
          this.selectedProductPromotion.desc,
          this.selectedProductPromotion.qty,
          this.selectedProductPromotion.disc,
          this.selectedProductPromotion.discpctg,
          this.selectedProductPromotion.promostartdate.substring(0, 10),
          this.selectedProductPromotion.promoenddate.substring(0, 10)
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'The Promotion Plan has been updated!', 'success');
          this.closeEditProductPromotionModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Promotion Plan, please try again later!', 'danger');
        }
        this.loadingService.dismiss();
      }, error => {
        console.log('API Error while updating ProductPromotion plan.');
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Promotion Plan, please try again later!', 'danger');
        this.loadingService.dismiss();
      });
    }
  }

  deleteProductPromotion() {
    this.globalFunctionService.presentAlertConfirm('Warning!',
        'Are you sure you want to delete the Promotion Plan?',
        'Cancel', 'Confirm',
        undefined, () => this.confirmDeleteProductPromotion());
  }

  confirmDeleteProductPromotion() {
    this.loadingService.present();
    this.deleteProductPromotionSubscription = this.productPromotionControllerService.deleteProductPromotionByUid(
        this.promoUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Promotion Plan has been deleted!', 'success');
        this.closeEditProductPromotionModal(true);
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Promotion Plan, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while deleting the Promotion Plan, please try again later!');
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Promotion Plan, please try again later!', 'danger');
    });
  }
}
