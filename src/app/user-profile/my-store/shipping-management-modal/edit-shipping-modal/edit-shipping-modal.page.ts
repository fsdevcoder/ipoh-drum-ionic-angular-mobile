import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ShippingControllerServiceService} from '../../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-shipping-modal',
  templateUrl: './edit-shipping-modal.page.html',
  styleUrls: ['./edit-shipping-modal.page.scss'],
})

export class EditShippingModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  shippingUid: string;

  // Regex
  weightRegex = new RegExp(/^\d+(\.\d+)?$/);

  // Booleans
  allowToModify: boolean;
  isLoadingShipping = true;

  // Numbers
  selectedStoreId: number;
  shippingPlanNameMaxLength = 50;
  shippingPlanDescriptionMinLength = 5;
  shippingPlanDescriptionMaxLength = 100;
  shippingPlanPriceMaxLength = 5;
  shippingPlanMaxWeightageMaxLength = 10;
  shippingPlanMaxDimensionMaxLength = 20;

  // Objects
  selectedShipping: any;

  // FormGroups
  shippingPlanFormGroup: FormGroup;

  // Subscriptions
  getShippingByUidSubscription: any;
  updateShippingByUidSubscription: any;
  deleteShippingByUidSubscription: any;

  constructor(
      private modalController: ModalController,
      private ngZone: NgZone,
      private ref: ChangeDetectorRef,
      private shippingControllerService: ShippingControllerServiceService,
      private globalFunctionService: GlobalfunctionService,
      private loadingService: LoadingService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.loadingService.present();
      this.shippingPlanFormGroup = new FormGroup({
        shippingPlanName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.shippingPlanNameMaxLength)
        ]),
        shippingPlanDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.shippingPlanDescriptionMinLength),
          Validators.maxLength(this.shippingPlanDescriptionMaxLength)
        ]),
        shippingPlanPrice: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.weightRegex),
          Validators.maxLength(this.shippingPlanPriceMaxLength)
        ]),
        shippingPlanMaxWeightage: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.weightRegex),
          Validators.maxLength(this.shippingPlanMaxWeightageMaxLength)
        ]),
        shippingPlanMaxDimension: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.weightRegex),
          Validators.maxLength(this.shippingPlanMaxDimensionMaxLength)
        ])
      });

      this.getShippingByUidSubscription = this.shippingControllerService.getShippingByUid(
          this.shippingUid
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.selectedShipping = resp.data;
        } else {
          this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Shipping Plan, please try again later!', 'warning');
          this.closeEditShippingModal(false);
        }
        this.loadingService.dismiss();
        this.isLoadingShipping = false;
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while retrieving Shipping Plan by uid.');
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Shipping Plan, please try again later!', 'warning');
        this.loadingService.dismiss();
        this.closeEditShippingModal(false);
        this.isLoadingShipping = false;
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
      if (this.getShippingByUidSubscription) {
        this.getShippingByUidSubscription.unsubscribe();
      }
      if (this.updateShippingByUidSubscription) {
        this.updateShippingByUidSubscription.unsubscribe();
      }
      if (this.deleteShippingByUidSubscription) {
        this.deleteShippingByUidSubscription.unsubscribe();
      }
    });
  }

  closeEditShippingModal(returnFromEditShipping: boolean) {
    this.modalController.dismiss(returnFromEditShipping);
  }

  updateShippingPlan() {
    if (this.shippingPlanFormGroup.valid) {
      this.loadingService.present();
      this.updateShippingByUidSubscription = this.shippingControllerService.updateShippingByUid(
          this.shippingUid,
          this.selectedShipping.name,
          this.selectedShipping.store_id,
          this.selectedShipping.price,
          this.selectedShipping.maxweight,
          this.selectedShipping.maxdimension,
          this.selectedShipping.desc
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'The Shipping Plan has been updated!', 'success');
          this.closeEditShippingModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Shipping Plan, please try again later!', 'danger');
        }
        this.loadingService.dismiss();
      }, error => {
        console.log('API Error while updating Shipping plan.');
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Shpping Plan, please try again later!', 'danger');
        this.loadingService.dismiss();
      });
    }
  }

  deleteShippingPlan() {
    this.globalFunctionService.presentAlertConfirm('Warning!',
        'Are you sure you want to delete the Shipping Plan?',
        'Cancel', 'Confirm',
        undefined, () => this.confirmDeleteShipping());
  }

  confirmDeleteShipping() {
    this.loadingService.present();
    this.deleteShippingByUidSubscription = this.shippingControllerService.deleteShippingByUid(
        this.shippingUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Shipping Plan has been deleted!', 'success');
        this.closeEditShippingModal(true);
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Shipping Plan, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while deleting the Shipping Plan, please try again later!');
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Shipping Plan, please try again later!', 'danger');
    });
  }
}
