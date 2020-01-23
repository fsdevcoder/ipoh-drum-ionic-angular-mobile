import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Stripe} from '@ionic-native/stripe/ngx';
import {ModalController} from '@ionic/angular';
import {commonConfig} from '../../_dal/common/commonConfig';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentControllerServiceService, VideoControllerServiceService} from '../../_dal/ipohdrum';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../_dal/common/services/authentication.service';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../_dal/common/services/loading.service';

@Component({
    selector: 'app-payment-info-modal',
    templateUrl: './payment-info-modal.page.html',
    styleUrls: ['./payment-info-modal.page.scss'],
})

export class PaymentInfoModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    phoneNumberRegex = commonConfig.phoneNumberRegex;
    // numericOnlyRegex = commonConfig.numericOnlyRegex;
    // cardNumberFirstPart: string;
    // cardNumberSecondPart: string;
    // cardNumberThirdPart: string;
    // cardNumberFourthPart: string;

    // NgModels
    // cardNumberModel: number;
    // expiryMonthModel = 1;
    // expiryYearModel: number;
    // cvvModel: number;
    contactNumModel: string;

    // Numbers
    minLengthOfPhoneNumber = commonConfig.minLengthOfPhoneNumber;
    maxLengthOfPhoneNumber = commonConfig.maxLengthOfPhoneNumber;
    userId: number;
    videoId: number;
    // currentYear = (new Date()).getFullYear();
    // endYear: number;
    // yearSubtraction = 20;
    // cardNumberMinLength = commonConfig.cardNumberMinLength;
    // cardCvvMinLength = commonConfig.cardSvvMinLength;

    // Booleans
    buyInventoryFlag = false;
    buyVideoFlag = false;

    // Arrays
    // listOfMonths = [
    //     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    // ];
    // listOfYears: Array<number> = [];
    finalSaleInventory: Array<any>;

    // Objects
    stripeHandler: any;
    // cardInfo: any = {
    //     number: '',
    //     expMonth: '',
    //     expYear: '',
    //     cvc: ''
    // };

    // FormGroups
    // cardInfoFormGroup: FormGroup;
    contactNumFormGroup: FormGroup;

    // Subscriptions
    makeInventoryPaymentSubscription: any;
    makeVideoPaymentSubscription: any;

    constructor(
        private ngZone: NgZone,
        private modalController: ModalController,
        private httpClient: HttpClient,
        private stripe: Stripe,
        private loadingService: LoadingService,
        private authenticationService: AuthenticationService,
        private globalFunctionService: GlobalfunctionService,
        private paymentControllerService: PaymentControllerServiceService
    ) {
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.initializeUserInfo();
            this.contactNumFormGroup = new FormGroup({
                contactNum: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.minLengthOfPhoneNumber),
                    Validators.maxLength(this.maxLengthOfPhoneNumber),
                    Validators.pattern(this.phoneNumberRegex)
                ])
            });
            this.stripeHandler = StripeCheckout.configure({
                key: environment.stripeKey,
                locale: 'auto',
                token: token => {
                    this.loadingService.present();
                    if (this.buyInventoryFlag) {
                        if (this.makeInventoryPaymentSubscription) {
                            this.makeInventoryPaymentSubscription.unsubscribe();
                        }
                        this.makeInventoryPaymentSubscription = this.paymentControllerService.createInventoryPayment(
                            token.id.toString(),
                            token.email.toString(),
                            this.contactNumModel,
                            JSON.stringify(this.finalSaleInventory),
                            this.userId
                        ).subscribe(resp => {
                            if (resp.code === 200) {
                                this.globalFunctionService.simpleToast('SUCCESS', 'Payment has been successfully made!', 'success');
                                this.closePaymentInfoModal(true);
                            } else {
                                this.globalFunctionService.simpleToast('ERROR', 'Transaction failed, please try again later!', 'danger');
                                this.closePaymentInfoModal(false);
                            }
                            this.loadingService.dismiss();
                        }, error => {
                            this.globalFunctionService.simpleToast('ERROR', 'Transaction failed, please try again later!', 'danger');
                            this.closePaymentInfoModal(false);
                            this.loadingService.dismiss();
                        });
                    }
                    if (this.buyVideoFlag) {
                        if (this.makeVideoPaymentSubscription) {
                            this.makeVideoPaymentSubscription.unsubscribe();
                        }
                        this.makeVideoPaymentSubscription = this.paymentControllerService.createVideoPayment(
                            token.id,
                            token.email.toString(),
                            this.videoId,
                            this.userId
                        ).subscribe(resp => {
                            if (resp.code === 200) {
                                this.globalFunctionService.simpleToast('SUCCESS', 'Payment has been successfully made!', 'success');
                                this.closePaymentInfoModal(true);
                            } else {
                                this.globalFunctionService.simpleToast('ERROR', 'Transaction failed, please try again later!', 'danger');
                                this.closePaymentInfoModal(false);
                            }
                            this.loadingService.dismiss();
                        }, error => {
                            this.globalFunctionService.simpleToast('ERROR', 'Transaction failed, please try again later!', 'danger');
                            this.closePaymentInfoModal(false);
                            this.loadingService.dismiss();
                        });
                    }
                }
            });
            // this.cardInfoFormGroup = new FormGroup({
            //     cardNumber: new FormControl(null, [
            //         Validators.required,
            //         Validators.minLength(this.cardNumberMinLength),
            //         Validators.pattern(this.numericOnlyRegex)
            //     ]),
            //     cardExpiryMonth: new FormControl(),
            //     cardExpiryYear: new FormControl(),
            //     cardCvv: new FormControl(null, [
            //         Validators.required,
            //         Validators.minLength(this.cardCvvMinLength),
            //         Validators.pattern(this.numericOnlyRegex)
            //     ])
            // });
            // this.expiryYearModel = this.currentYear;
            // this.endYear = this.currentYear + this.yearSubtraction;
            // this.generateListOfYears();
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
            if (this.makeInventoryPaymentSubscription) {
                this.makeInventoryPaymentSubscription.unsubscribe();
            }
            if (this.makeVideoPaymentSubscription) {
                this.makeVideoPaymentSubscription.unsubscribe();
            }
        });
    }

    initializeUserInfo() {
        this.authenticationService.authenticate().then(resp => {
            if (resp.status) {
                if (resp.status === 200) {
                    this.userId = resp.data.id;
                }
            } else {
                if (resp.name === 'Error') {
                    this.userId = null;
                    // this.globalFunctionService.simpleToast('ERROR!', 'You are not authenticated, please login first!', 'danger');
                    // this.router.navigate(['/login']);
                }
            }
        }, error => {
            this.userId = null;
            // this.globalFunctionService.simpleToast('ERROR!', 'You are not authenticated, please login first!', 'danger');
            // this.router.navigate(['/login']);
        });
    }

    pay() {
        this.stripeHandler.open({
            name: 'IpohDrum',
            description: 'Payment Information'
        });
    }

    closePaymentInfoModal(returnFromSuccessfulPayment: boolean) {
        this.modalController.dismiss(returnFromSuccessfulPayment);
    }

    // generateListOfYears() {
    //     for (let i = this.endYear; i >= this.currentYear - this.yearSubtraction; i--) {
    //         this.listOfYears.push(i);
    //     }
    // }

    // cardNumberChange() {
    //     // First Part
    //     if (this.cardNumberModel) {
    //         if (this.cardNumberModel.toString().length > 3) {
    //             this.cardNumberFirstPart = this.cardNumberModel.toString().substr(0, 4);
    //         } else {
    //             this.cardNumberFirstPart = '';
    //             for (let i = 0; i < 4; i++) {
    //                 if (this.cardNumberModel.toString().substr(i, 1)) {
    //                     this.cardNumberFirstPart += this.cardNumberModel.toString().charAt(i);
    //                 } else {
    //                     this.cardNumberFirstPart += 'X';
    //                 }
    //             }
    //         }
    //         // Second Part
    //         if (this.cardNumberModel.toString().length > 7) {
    //             this.cardNumberSecondPart = this.cardNumberModel.toString().substr(4, 4);
    //         } else {
    //             this.cardNumberSecondPart = '';
    //             for (let i = 4; i < 8; i++) {
    //                 if (this.cardNumberModel.toString().substr(i, 1)) {
    //                     this.cardNumberSecondPart += this.cardNumberModel.toString().charAt(i);
    //                 } else {
    //                     this.cardNumberSecondPart += 'X';
    //                 }
    //             }
    //         }
    //         // Third Part
    //         if (this.cardNumberModel.toString().length > 11) {
    //             this.cardNumberThirdPart = this.cardNumberModel.toString().substr(8, 4);
    //         } else {
    //             this.cardNumberThirdPart = '';
    //             for (let i = 8; i < 12; i++) {
    //                 if (this.cardNumberModel.toString().substr(i, 1)) {
    //                     this.cardNumberThirdPart += this.cardNumberModel.toString().charAt(i);
    //                 } else {
    //                     this.cardNumberThirdPart += 'X';
    //                 }
    //             }
    //         }
    //         // Fourth Part
    //         if (this.cardNumberModel.toString().length > 15) {
    //             this.cardNumberFourthPart = this.cardNumberModel.toString().substr(12, 4);
    //         } else {
    //             this.cardNumberFourthPart = '';
    //             for (let i = 12; i < 16; i++) {
    //                 if (this.cardNumberModel.toString().substr(i, 1)) {
    //                     this.cardNumberFourthPart += this.cardNumberModel.toString().charAt(i);
    //                 } else {
    //                     this.cardNumberFourthPart += 'X';
    //                 }
    //             }
    //         }
    //     }
    // }
}
