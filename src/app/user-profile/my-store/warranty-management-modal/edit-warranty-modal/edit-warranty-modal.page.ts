import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {WarrantyControllerServiceService} from '../../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-edit-warranty-modal',
    templateUrl: './edit-warranty-modal.page.html',
    styleUrls: ['./edit-warranty-modal.page.scss'],
})

export class EditWarrantyModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    warrantyUid: string;

    // Regex
    numericOnlyRegex = commonConfig.numericOnlyRegex;

    // Boolean
    allowToModify: boolean;
    isLoadingWarranty = true;

    // Numbers
    selectedStoreId: number;
    warrantyNameMinLength = 2;
    warrantyNameMaxLength = 50;
    warrantyDescriptionMinLength = 10;
    warrantyDescriptionMaxLength = 500;
    warrantyPeriodMaxLength = 5;
    warrantyPolicyMaxLength = 1500;

    // Objects
    selectedWarranty: any;

    // FormGroups
    warrantyPlanFormGroup: FormGroup;

    // Subscriptions
    getWarrantyByUidSubscription: any;
    updateWarrantySubscription: any;
    deleteWarrantySubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private warrantyControllerService: WarrantyControllerServiceService,
        private globalFunctionService: GlobalfunctionService,
        private modalController: ModalController
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.loadingService.present();
            this.warrantyPlanFormGroup = new FormGroup({
                warrantyName: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.warrantyNameMinLength),
                    Validators.maxLength(this.warrantyNameMaxLength)
                ]),
                warrantyDescription: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.warrantyDescriptionMinLength),
                    Validators.maxLength(this.warrantyDescriptionMaxLength)
                ]),
                warrantyPeriod: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(this.numericOnlyRegex),
                    Validators.maxLength(this.warrantyPeriodMaxLength)
                ]),
                warrantyPolicy: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.warrantyPolicyMaxLength)
                ])
            });

            this.getWarrantyByUidSubscription = this.warrantyControllerService.getWarrantyByUid(
                this.warrantyUid
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.selectedWarranty = resp.data;
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Warranty Plan, please try again later!', 'warning');
                    this.closeEditWarrantyModal(false);
                }
                this.loadingService.dismiss();
                this.isLoadingWarranty = false;
                this.ref.detectChanges();
            }, error => {
                console.log('API Error while retrieving Warranty Plan by uid.');
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve the Warranty Plan, please try again later!', 'warning');
                this.loadingService.dismiss();
                this.closeEditWarrantyModal(false);
                this.isLoadingWarranty = false;
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
            if (this.getWarrantyByUidSubscription) {
                this.getWarrantyByUidSubscription.unsubscribe();
            }
            if (this.updateWarrantySubscription) {
                this.updateWarrantySubscription.unsubscribe();
            }
            if (this.deleteWarrantySubscription) {
                this.deleteWarrantySubscription.unsubscribe();
            }
        });
    }

    closeEditWarrantyModal(returnFromEditWarranty: boolean) {
        this.modalController.dismiss(returnFromEditWarranty);
    }

    updateWarrantyPlan() {
        if (this.warrantyPlanFormGroup.valid) {
            this.loadingService.present();
            this.updateWarrantySubscription = this.warrantyControllerService.updateWarrantyByUid(
                this.warrantyUid,
                this.selectedWarranty.name,
                this.selectedWarranty.store_id,
                this.selectedWarranty.period,
                this.selectedWarranty.policy,
                this.selectedWarranty.desc
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Warranty Plan has been updated!', 'success');
                    this.closeEditWarrantyModal(true);
                } else {
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Warranty Plan, please try again later!', 'danger');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while updating Warranty by uid.');
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Warranty Plan, please try again later!', 'danger');
            });
        }
    }

    deleteWarrantyPlan() {
        this.globalFunctionService.presentAlertConfirm('Warning!',
            'Are you sure you want to delete the Warranty Plan?',
            'Cancel', 'Confirm',
            undefined, () => this.confirmDeleteWarranty());
    }

    confirmDeleteWarranty() {
        this.loadingService.present();
        if (this.deleteWarrantySubscription) {
            this.deleteWarrantySubscription.unsubscribe();
        }
        this.deleteWarrantySubscription = this.warrantyControllerService.deleteWarrantyByUid(
            this.warrantyUid
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.globalFunctionService.simpleToast('SUCCESS', 'The Warranty Plan has been deleted!', 'success');
                this.closeEditWarrantyModal(true);
            } else {
                this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Warranty Plan, please try again later!', 'danger');
            }
            this.loadingService.dismiss();
        }, error => {
            console.log('API Error while deleting the Warranty Plan, please try again later!');
            this.loadingService.dismiss();
            this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Warranty Plan, please try again later!', 'danger');
        });
    }
}
