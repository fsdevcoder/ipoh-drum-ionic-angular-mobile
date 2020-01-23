import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {WarrantyControllerServiceService} from '../../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-add-warranty-modal',
    templateUrl: './add-warranty-modal.page.html',
    styleUrls: ['./add-warranty-modal.page.scss'],
})

export class AddWarrantyModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedStoreUid: string;

    // Regex
    numericOnlyRegex = commonConfig.numericOnlyRegex;

    // NgModels
    warrantyNameModel: string;
    warrantyDescriptionModel: string;
    warrantyPeriodModel: number;
    warrantyPolicyModel: string;

    // Numbers
    selectedStoreId: number;
    warrantyNameMinLength = 2;
    warrantyNameMaxLength = 50;
    warrantyDescriptionMinLength = 10;
    warrantyDescriptionMaxLength = 500;
    warrantyPeriodMaxLength = 5;
    warrantyPolicyMaxLength = 1500;

    // FormGroups
    warrantyPlanFormGroup: FormGroup;

    // Subscriptions
    createWarrantySubscription: any;

    constructor(
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private globalFunctionService: GlobalfunctionService,
        private warrantyControllerService: WarrantyControllerServiceService,
        private modalController: ModalController
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
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
            if (this.createWarrantySubscription) {
                this.createWarrantySubscription.unsubscribe();
            }
        });
    }

    closeCreateWarrantyModal(returnFromCreatingWarranty: boolean) {
        this.modalController.dismiss(returnFromCreatingWarranty);
    }

    createWarrantyPlan() {
        if (this.warrantyPlanFormGroup.valid) {
            this.loadingService.present();
            this.createWarrantySubscription = this.warrantyControllerService.createWarranty(
                this.warrantyNameModel,
                this.warrantyPeriodModel,
                this.warrantyPolicyModel,
                this.selectedStoreId,
                this.warrantyDescriptionModel
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Warranty Plan has been created!', 'success');
                    this.closeCreateWarrantyModal(true);
                } else {
                  // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to create the Warranty Plan, please try again later!', 'danger');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while creating a new warranty plan.');
                this.globalFunctionService.simpleToast('ERROR', 'Unable to create the Warranty Plan, please try again later!', 'danger');
                this.loadingService.dismiss();
            });
        }
    }
}
