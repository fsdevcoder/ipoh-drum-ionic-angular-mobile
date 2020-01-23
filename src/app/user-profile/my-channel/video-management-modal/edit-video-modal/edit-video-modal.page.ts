import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {Video, VideoControllerServiceService} from '../../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-edit-video-modal',
    templateUrl: './edit-video-modal.page.html',
    styleUrls: ['./edit-video-modal.page.scss'],
})

export class EditVideoModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedVideoUid: string;
    temporaryVideoImageURL: string;

    // NgModels
    videoIsFreeFlagModel = false;
    videoIsPublicFlagModel = false;
    videoDiscountedByPriceFlagModel = false;

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

    // Booleans
    isLoadingVideoInfo = true;

    // Arrays
    videoImageAsBlobArray: Array<Blob> = [];

    // ViewChilds
    @ViewChild('videoImageContainer', {static: false}) videoImageContainer: ElementRef;

    // Objects
    selectedVideo: Video;

    // FormGroups
    videoInfoFormGroup: FormGroup;
    videoNotFreeFormGroup: FormGroup;

    // Subscriptions
    getSelectedVideoToEditSubscription: any;
    updateSelectedVideoToEditSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private globalFunctionService: GlobalfunctionService,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private videoControllerService: VideoControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
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
            this.retrieveSelectedVideoByUid();
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
            if (this.getSelectedVideoToEditSubscription) {
                this.getSelectedVideoToEditSubscription.unsubscribe();
            }
        });
    }

    retrieveSelectedVideoByUid() {
        this.isLoadingVideoInfo = true;
        this.loadingService.present();
        if (this.getSelectedVideoToEditSubscription) {
            this.getSelectedVideoToEditSubscription.unsubscribe();
        }
        this.getSelectedVideoToEditSubscription = this.videoControllerService.getVideoByUid(
            this.selectedVideoUid
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.selectedVideo = resp.data;
                this.selectedVideo.free === 1 ? this.videoIsFreeFlagModel = true : this.videoIsFreeFlagModel = false;
                this.selectedVideo.scope === 'public' ? this.videoIsPublicFlagModel = true : this.videoIsPublicFlagModel = false;
                this.selectedVideo.disc === 1 ? this.videoDiscountedByPriceFlagModel = true : this.videoDiscountedByPriceFlagModel = false;
            } else {
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve selected Video info, please try again later!', 'warning');
                this.closeEditVideoModal(false);
            }
            this.enableDisableDiscountedPriceAndPercentage();
            this.loadingService.dismiss();
            this.isLoadingVideoInfo = false;
            this.ref.detectChanges();
        }, error => {
            console.log('API Error while retrieving selected Video by uid.');
            console.log(error);
            this.loadingService.dismiss();
            this.isLoadingVideoInfo = false;
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve selected Video info, please try again later!', 'warning');
            this.closeEditVideoModal(false);
            this.ref.detectChanges();
        });
    }

    closeEditVideoModal(returnFromEditingVideo: boolean) {
        this.modalController.dismiss(returnFromEditingVideo);
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
                        this.ref.detectChanges();
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

    resetUploadedTempPhoto() {
        this.globalFunctionService.presentAlertConfirm(
            'Warning',
            'Are you sure you want to reset the uploaded thumbnail?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.resetThumbnail());
    }

    resetThumbnail() {
        this.loadingService.present();
        setTimeout(() => {
            this.temporaryVideoImageURL = null;
            this.videoImageAsBlobArray = [];
            this.loadingService.dismiss();
            this.ref.detectChanges();
        }, 500);
    }

    toggleVideoDiscountedByPrice() {
        this.enableDisableDiscountedPriceAndPercentage();
        this.ref.detectChanges();
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

    updateVideo() {
        if (this.videoInfoFormGroup.valid
            && ((!this.videoIsFreeFlagModel && this.videoNotFreeFormGroup.valid) || (this.videoIsFreeFlagModel))) {
            this.loadingService.present();
            if (this.updateSelectedVideoToEditSubscription) {
                this.updateSelectedVideoToEditSubscription.unsubscribe();
            }
            this.updateSelectedVideoToEditSubscription = this.videoControllerService.updateVideoByUid(
                this.selectedVideoUid,
                this.selectedChannelId,
                this.selectedVideo.title,
                this.videoIsPublicFlagModel === true ? 'public' : 'private',
                this.selectedVideo.videopath,
                this.selectedVideo.videopublicid,
                this.selectedVideo.totallength,
                this.videoIsFreeFlagModel === true ? 1 : 0,
                this.videoDiscountedByPriceFlagModel === true ? 1 : 0,
                this.selectedVideo.desc,
                this.selectedVideo.price,
                this.selectedVideo.disc,
                this.selectedVideo.discpctg,
                'PUT',
                this.videoImageAsBlobArray[0] !== undefined || this.videoImageAsBlobArray[0] !== null ? this.videoImageAsBlobArray : null
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Video has been updated!', 'success');
                    this.closeEditVideoModal(true);
                } else {
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to update Video, please try again later!', 'danger');
                }
                this.loadingService.dismiss();
                this.ref.detectChanges();
            }, error => {
                console.log('API Error while updating Video');
                console.log(error);
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('ERROR', 'Unable to update Video, please try again later!', 'danger');
                this.ref.detectChanges();
            });
        }
    }

    toggleVideoIsFreeFlag() {
        this.ref.detectChanges();
    }
}
