import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {VideoControllerServiceService} from '../../../../_dal/ipohdrum';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-create-video-modal',
    templateUrl: './create-video-modal.page.html',
    styleUrls: ['./create-video-modal.page.scss'],
})

export class CreateVideoModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    temporaryVideoImageURL: string;

    // NgModels
    videoTitleModel: string;
    videoDescriptionModel: string;
    videoLinkModel: string;
    videoIdModel: string;
    videoTotalLengthModel: string;
    videoIsPublicFlagModel = true;
    videoIsFreeFlagModel = false;
    videoPriceModel: number;
    videoDiscountedByPriceFlagModel = true;
    videoDiscountedPriceModel: number;
    videoDiscountedPercentageModel: number;

    // Numbers
    selectedChannelId: number;
    maxPercentageValue = 100;
    videoTitleMaxLength = commonConfig.videoTitleMaxLength;
    videoLinkMaxLength = commonConfig.videoLinkMaxLength;
    videoIdMaxLength = commonConfig.videoIdMaxLength;
    videoTotalLengthMaxLength = commonConfig.videoTotalLengthMaxLength;

    // Regex
    priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
    numericOnlyRegex = commonConfig.numericOnlyRegex;
    percentageRegex = commonConfig.percentageRegex;

    // Arrays
    videoImageAsBlobArray: Array<Blob> = [];

    // ViewChilds
    @ViewChild('videoImageContainer', {static: false}) videoImageContainer: ElementRef;

    // FormGroups
    videoInfoFormGroup: FormGroup;
    videoNotFreeFormGroup: FormGroup;

    // Subscriptions
    createVideoSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private videoControllerService: VideoControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            console.log('channl id to create ivdoe: ' + this.selectedChannelId);
            this.videoInfoFormGroup = new FormGroup({
                videoTitle: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.videoTitleMaxLength)
                ]),
                videoDescription: new FormControl(),
                videoLink: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.videoLinkMaxLength)
                ]),
                videoId: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.videoIdMaxLength)
                ]),
                videoTotalLength: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.videoTotalLengthMaxLength)
                ]),
                videoIsPublicFlag: new FormControl(),
                videoIsFreeFlag: new FormControl()
            });
            this.videoNotFreeFormGroup = new FormGroup({
                videoPrice: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(this.priceRegex)
                ]),
                videoDiscountedByPriceFlag: new FormControl(),
                videoDiscountedPrice: new FormControl(),
                videoDiscountedPercentage: new FormControl()
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
            if (this.createVideoSubscription) {
                this.createVideoSubscription.unsubscribe();
            }
        });
    }

    closeCreateVideoModal(returnFromCreatingVideo: boolean) {
        this.modalController.dismiss(returnFromCreatingVideo);
    }

    openVideoImageFilePicker() {
        this.videoImageContainer.nativeElement.click();
    }

    uploadVideoImage(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            if (files.length) {
                if (files[0].type.toString().includes('image')) {
                    // Actual Blob File
                    this.videoImageAsBlobArray[0] = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        // Some URL for displaying purpose only
                        this.temporaryVideoImageURL = e.target.result;
                        this.loadingService.dismiss();
                    };
                    reader.readAsDataURL(files[0]);
                } else {
                    this.globalFunctionService.simpleToast('ERROR!', 'Invalid file selected! Please select .jpeg, .jpg or .png files.', 'danger');
                    this.loadingService.dismiss();
                }
            } else {
                this.loadingService.dismiss();
            }
        }, 500);
    }

    enableDisableDiscountedPriceAndPercentage() {
        if (this.videoDiscountedByPriceFlagModel) {
            this.videoNotFreeFormGroup.controls.videoDiscountedPrice.setValidators([
                Validators.required,
                Validators.pattern(this.priceRegex),
                Validators.min(0.01)
            ]);
            this.videoNotFreeFormGroup.get('videoDiscountedPrice').enable();
            this.videoNotFreeFormGroup.get('videoDiscountedPercentage').disable();
            this.videoNotFreeFormGroup.get('videoDiscountedPercentage').setValue(0.00);
        } else {
            this.videoNotFreeFormGroup.controls.videoDiscountedPercentage.setValidators([
                Validators.required,
                Validators.pattern(this.percentageRegex),
                Validators.min(1),
                Validators.max(this.maxPercentageValue)
            ]);
            this.videoNotFreeFormGroup.get('videoDiscountedPrice').disable();
            this.videoNotFreeFormGroup.get('videoDiscountedPercentage').enable();
            this.videoNotFreeFormGroup.get('videoDiscountedPercentage').setValue(0.00);
        }
        this.ref.detectChanges();
    }

    toggleVideoDiscountedByPrice() {
        this.enableDisableDiscountedPriceAndPercentage();
    }

    toggleVideoFreeToWatch() {
        if (this.videoIsFreeFlagModel) {
            this.videoNotFreeFormGroup.get('videoPrice').reset();
            this.videoNotFreeFormGroup.get('videoDiscountedPrice').reset();
            this.videoNotFreeFormGroup.get('videoDiscountedPercentage').reset();
            this.videoDiscountedByPriceFlagModel = true;
        }
    }

    createVideo() {
        if (this.videoInfoFormGroup.valid
            && ((!this.videoIsFreeFlagModel && this.videoNotFreeFormGroup.valid) || (this.videoIsFreeFlagModel))
            && this.temporaryVideoImageURL) {
            this.loadingService.present();
            if (this.createVideoSubscription) {
                this.createVideoSubscription.unsubscribe();
            }
            this.createVideoSubscription = this.videoControllerService.createVideo(
                this.selectedChannelId,
                this.videoTitleModel,
                this.videoIsPublicFlagModel === true ? 'public' : 'private',
                this.videoLinkModel,
                this.videoIdModel,
                this.videoTotalLengthModel,
                this.videoIsFreeFlagModel === true ? 1 : 0,
                this.videoDiscountedByPriceFlagModel === true ? 1 : 0,
                this.videoDescriptionModel,
                this.videoPriceModel,
                this.videoDiscountedPriceModel,
                this.videoDiscountedPercentageModel,
                this.videoImageAsBlobArray
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Video has been created!', 'success');
                    this.closeCreateVideoModal(true);
                } else {
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to create Video, please try again later!', 'danger');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while creating a new Video');
                console.log(error);
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('ERROR', 'Unable to create Video, please try again later!', 'danger');
            });
        }
    }
}
