import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {ArticleControllerServiceService} from '../../../../_dal/ipohdrum';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-create-article-modal',
    templateUrl: './create-article-modal.page.html',
    styleUrls: ['./create-article-modal.page.scss'],
})

export class CreateArticleModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedBloggerUid: string;

    // NgModels
    articleTitleModel: string;
    articleDescriptionModel: string;
    articleIsPublicFlagModel = false;

    // Numbers
    selectedBloggerId: number;
    articleTitleMaxLength = commonConfig.articleTitleMaxLength;
    articleDescriptionMaxLength = commonConfig.articleDescriptionMaxLength;
    maxArticleImageNumbers = commonConfig.maxArticleImageNumbers;

    // Arrays
    temporaryArticleSliders: Array<Blob> = [];
    articleSlidersAsArray: Array<Blob> = [];

    // ViewChilds
    @ViewChild('articleSlidersContainer', {static: false}) articleSlidersContainer: ElementRef;

    // Objects
    articleImageSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400
    };

    // FormGroups
    articleInfoFormGroup: FormGroup;

    // Subscriptions
    createArticleSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private loadingService: LoadingService,
        private articleControllerService: ArticleControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.articleInfoFormGroup = new FormGroup({
                articleTitle: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.articleTitleMaxLength)
                ]),
                articleDescription: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(this.articleDescriptionMaxLength)
                ]),
                articleIsPublicFlag: new FormControl()
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
            if (this.createArticleSubscription) {
                this.createArticleSubscription.unsubscribe();
            }
        });
    }

    closeCreateArticleModal(returnFromCreatingArticle: boolean) {
        this.modalController.dismiss(returnFromCreatingArticle);
    }

    resetSelectedArticleImages() {
        this.globalFunctionService.presentAlertConfirm(
            'Warning',
            'Are you sure you want to reset the uploaded Article Images?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.resetArticleImages());
    }

    resetArticleImages() {
        this.temporaryArticleSliders = [];
        this.articleSlidersAsArray = [];
    }

    openSlidersFilePicker() {
        this.articleSlidersContainer.nativeElement.click();
    }

    uploadArticleSliders(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            // tslint:disable-next-line:max-line-length
            if (this.temporaryArticleSliders.length < this.maxArticleImageNumbers && (files.length + this.temporaryArticleSliders.length <= this.maxArticleImageNumbers)) {
                if (files) {
                    for (const file of files) {
                        if (file.type.toString().includes('image')) {
                            this.articleSlidersAsArray.push(file);
                            const reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.temporaryArticleSliders.push(e.target.result);
                                this.loadingService.dismiss();
                            };
                            reader.readAsDataURL(file);
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.globalFunctionService.simpleToast('ERROR!', 'Invalid file selected! Please select .jpeg, .jpg or .png files.', 'danger');
                            this.loadingService.dismiss();
                            break;
                        }
                    }
                } else {
                    this.loadingService.dismiss();
                }
            } else {
                this.globalFunctionService.simpleToast('WARNING', 'You have reached the max number of uploaded photos!', 'warning', 'top');
                this.loadingService.dismiss();
            }
        }, 500);
    }

    createArticle() {
        if (this.articleInfoFormGroup.valid) {
            this.loadingService.present();
            if (this.createArticleSubscription) {
                this.createArticleSubscription.unsubscribe();
            }
            this.createArticleSubscription = this.articleControllerService.createArticle(
                this.selectedBloggerId,
                this.articleTitleModel,
                this.articleDescriptionModel,
                this.articleIsPublicFlagModel === true ? 'public' : 'private',
                this.articleSlidersAsArray
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'Article has been successfully created!', 'success', 'top');
                    this.closeCreateArticleModal(true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Article, please try again later!', 'warning', 'top');
                }
                this.loadingService.dismiss();
                this.ref.detectChanges();
            }, error => {
                console.log('API Error while creating a new Article.');
                console.log(error);
                this.loadingService.dismiss();
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Article, please try again later!', 'warning', 'top');
                this.ref.detectChanges();
            });
        }
    }
}
