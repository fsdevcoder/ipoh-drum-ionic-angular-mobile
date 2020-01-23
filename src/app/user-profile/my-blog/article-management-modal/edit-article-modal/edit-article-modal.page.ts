import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {Article, ArticleControllerServiceService, ArticleImageControllerServiceService} from '../../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../../_dal/common/services/loading.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../_dal/common/commonConfig';

@Component({
    selector: 'app-edit-article-modal',
    templateUrl: './edit-article-modal.page.html',
    styleUrls: ['./edit-article-modal.page.scss'],
})

export class EditArticleModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedArticleUid: string;

    // Numbers
    selectedArticleId: number;
    selectedBloggerId: number;
    articleTitleMaxLength = commonConfig.articleTitleMaxLength;
    articleDescriptionMaxLength = commonConfig.articleDescriptionMaxLength;
    maxArticleImageNumbers = commonConfig.maxArticleImageNumbers;

    // Booleans
    isLoadingArticleInfo = true;
    isArticlePublicScope = false;

    // Arrays
    articleImageSlidersAsArray: Array<Blob> = [];

    // ViewChilds
    @ViewChild('articleSlidersContainer', {static: false}) articleSlidersContainer: ElementRef;

    // Objects
    selectedArticle: Article;
    articleSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400
    };

    // FormGroups
    articleInfoFormGroup: FormGroup;

    // Subscriptions
    getSelectedArticleSubscription: any;
    updateArticleSubscription: any;
    uploadSlidersSubscription: any;
    removeSlidersSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private loadingService: LoadingService,
        private ngZone: NgZone,
        private globalFunctionService: GlobalfunctionService,
        private modalController: ModalController,
        private articleControllerService: ArticleControllerServiceService,
        private articleImageControllerService: ArticleImageControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            console.log('article uid: ' + this.selectedArticleUid);
            console.log('article id: ' + this.selectedArticleId);
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
            this.retrieveSelectedArticleByUid();
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
            if (this.getSelectedArticleSubscription) {
                this.getSelectedArticleSubscription.unsubscribe();
            }
            if (this.updateArticleSubscription) {
                this.updateArticleSubscription.unsubscribe();
            }
            if (this.uploadSlidersSubscription) {
                this.uploadSlidersSubscription.unsubscribe();
            }
            if (this.removeSlidersSubscription) {
                this.removeSlidersSubscription.unsubscribe();
            }
        });
    }

    retrieveSelectedArticleByUid() {
        this.isLoadingArticleInfo = true;
        this.loadingService.present();
        if (this.getSelectedArticleSubscription) {
            this.getSelectedArticleSubscription.unsubscribe();
        }
        this.getSelectedArticleSubscription = this.articleControllerService.getArticleByUid(
            this.selectedArticleUid
        ).subscribe(resp => {
            console.log(resp);
            if (resp.code === 200) {
                this.selectedArticle = resp.data;
                this.selectedArticle.scope === 'public' ? this.isArticlePublicScope = true : this.isArticlePublicScope = false;
            } else {
                this.closeEditArticleModal(false);
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Article\'s info, please try again later!', 'warning', 'top');
            }
            this.isLoadingArticleInfo = false;
            this.loadingService.dismiss();
            this.ref.detectChanges();
        }, error => {
            console.log('API Error while retrieving Article by uid.');
            console.log(error);
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Article\'s info, please try again later!', 'warning', 'top');
            this.isLoadingArticleInfo = false;
            this.loadingService.dismiss();
            this.closeEditArticleModal(false);
            this.ref.detectChanges();
        });
    }

    closeEditArticleModal(returnFromEditingArticle: boolean) {
        this.modalController.dismiss(returnFromEditingArticle);
    }

    removeSelectedSliderPhotoPrompt(selectedSliderUid: string) {
        this.globalFunctionService.presentAlertConfirm(
            'WARNING',
            'Are you sure you want to remove the Image?',
            'Cancel',
            'Confirm',
            undefined,
            () => this.removeSelectedSliderPhoto(selectedSliderUid)
        );
    }

    removeSelectedSliderPhoto(selectedSliderUid: string) {
        this.loadingService.present();
        setTimeout(() => {
            if (this.removeSlidersSubscription) {
                this.removeSlidersSubscription.unsubscribe();
            }
            this.removeSlidersSubscription = this.articleImageControllerService.deleteArticleImageByUid(
                selectedSliderUid
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Slider image has been updated!', 'success');
                    this.retrieveSelectedArticleByUid();
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('WARNING', 'Unable to remove the Slider image, please try again later!', 'warning');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while deleting sliders image.');
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('WARNING', 'Unable to remove the Slider image, please try again later!', 'warning');
            });
        }, 500);
    }

    openSlidersFilePicker() {
        this.articleSlidersContainer.nativeElement.click();
    }

    uploadArticleSliders(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
          const files = event.target.files;
          if (files.length > 0) {
            if (files[0].type.toString().includes('image')) {
              this.articleImageSlidersAsArray[0] = event.target.files[0];
              this.uploadSlidersSubscription = this.articleImageControllerService.createArticleImage(
                  this.selectedArticleId,
                  this.articleImageSlidersAsArray
              ).subscribe(resp => {
                if (resp.code === 200) {
                  this.globalFunctionService.simpleToast('SUCCESS', 'The Sliders has been updated!', 'success');
                  this.retrieveSelectedArticleByUid();
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.globalFunctionService.simpleToast('WARNING', 'Unable to update the Sliders, please try again later!', 'warning');
                }
                this.loadingService.dismiss();
              }, error => {
                console.log('API Error while uploading inventory Sliders by uid.');
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to update the Sliders, please try again later!', 'warning');
                console.log(error);
                this.loadingService.dismiss();
              });
            } else {
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('ERROR!', 'Invalid file selected! Please select .jpeg, .jpg or .png files.', 'danger');
                this.loadingService.dismiss();
            }
          } else {
              this.loadingService.dismiss();
          }
        }, 500);
    }

    updateArticle() {
        if (this.articleInfoFormGroup.valid) {
            this.loadingService.present();
            this.updateArticleSubscription = this.articleControllerService.updateArticleByUid(
                this.selectedArticleUid,
                this.selectedBloggerId,
                this.selectedArticle.title,
                this.selectedArticle.desc,
                this.isArticlePublicScope ? 'public' : 'private'
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'The Article has been updated!', 'success', 'top');
                    this.closeEditArticleModal(true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Article, please try again later!', 'danger', 'top');
                }
                this.loadingService.dismiss();
            }, error => {
                console.log('API Error while updating the Article');
                console.log(error);
                this.loadingService.dismiss();
                this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Article, please try again later!', 'danger', 'top');
            });
        }
    }
}
