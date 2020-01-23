import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {BloggerControllerServiceService, Company, CompanyControllerServiceService} from '../../../_dal/ipohdrum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
    selector: 'app-add-blog-modal',
    templateUrl: './add-blog-modal.page.html',
    styleUrls: ['./add-blog-modal.page.scss'],
})

export class AddBlogModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    temporaryBlogImageURL: string;

    // NgModels
    selectedBlogBelongsToCompanyFlag = false;
    selectedCompany: Company;
    blogNameModel: string;
    blogDescriptionModel: string;
    blogEmailModel: string;

    // Numbers
    currentCompanyPageNumber = 1;
    currentCompanyPageSize = 10;
    companyMaximumPages: number;
    blogNameMinLength = commonConfig.blogNameMinLength;
    blogNameMaxLength = commonConfig.blogNameMaxLength;
    blogDescriptionMinLength = commonConfig.blogDescriptionMinLength;
    blogDescriptionMaxLength = commonConfig.blogDescriptionMaxLength;

    // Arrays
    listOfCompanies: Array<Company> = [];
    blogImageAsBlobArray: Array<Blob> = [];

    // ViewChilds
    @ViewChild('blogImageContainer', {static: false}) blogImageContainer: ElementRef;

    // Objects
    blogImageSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400,
        noSwipingClass: 'no-swipe'
    };

    // FormGroups
    blogInfoFormGroup: FormGroup;

    // Subscriptions
    appendListOfCompaniesSubscription: any;
    searchListOfCompaniesSubscription: any;
    createNewBlogSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private bloggerControllerService: BloggerControllerServiceService,
        private companyControllerService: CompanyControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.blogInfoFormGroup = new FormGroup({
                blogName: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.blogNameMinLength),
                    Validators.maxLength(this.blogNameMaxLength)
                ]),
                blogDescription: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(this.blogDescriptionMinLength),
                    Validators.maxLength(this.blogDescriptionMaxLength)
                ]),
                blogEmail: new FormControl(null, [
                    Validators.required,
                    Validators.email
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
            if (this.appendListOfCompaniesSubscription) {
                this.appendListOfCompaniesSubscription.unsubscribe();
            }
            if (this.createNewBlogSubscription) {
                this.createNewBlogSubscription.unsubscribe();
            }
            if (this.searchListOfCompaniesSubscription) {
                this.searchListOfCompaniesSubscription.unsubscribe();
            }
        });
    }

    closeCreateBlogModal(returnFromCreatingBlog: boolean) {
        this.modalController.dismiss(returnFromCreatingBlog);
    }

    openBlogImageFilePicker() {
        this.blogImageContainer.nativeElement.click();
    }

    uploadBlogImage(event) {
        event.preventDefault();
        this.loadingService.present();
        setTimeout(() => {
            const files = event.target.files;
            if (files.length) {
                if (files[0].type.toString().includes('image')) {
                    // Actual Blob File
                    this.blogImageAsBlobArray[0] = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                        // Some URL for displaying purpose only
                        this.temporaryBlogImageURL = e.target.result;
                        this.loadingService.dismiss();
                    };
                    reader.readAsDataURL(files[0]);
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

    toggleBelongsToCompanyFlag() {
        this.selectedBlogBelongsToCompanyFlag = !this.selectedBlogBelongsToCompanyFlag;
        if (!this.selectedBlogBelongsToCompanyFlag) {
            this.selectedCompany = null;
        }
    }

    filterCompanies(companyList: Company[], text: string) {
        return companyList.filter(company => {
            return company.name.toLowerCase().indexOf(text) !== -1;
        });
    }

    searchForCompanies(event: {
        component: IonicSelectableComponent,
        text: string
    }) {
        const text = event.text.trim().toLowerCase();
        event.component.startSearch();
        if (this.searchListOfCompaniesSubscription) {
            this.searchListOfCompaniesSubscription.unsubscribe();
        }
        this.currentCompanyPageNumber = 1;
        if (!text) {
            if (this.searchListOfCompaniesSubscription) {
                this.searchListOfCompaniesSubscription.unsubscribe();
            }
            this.searchListOfCompaniesSubscription = this.companyControllerService.getCompanies(
                this.currentCompanyPageNumber,
                this.currentCompanyPageSize
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.listOfCompanies = resp.data;
                    this.companyMaximumPages = resp.maximumPages;
                    event.component.items = this.listOfCompanies;
                } else {
                    this.listOfCompanies = [];
                    this.companyMaximumPages = 0;
                }
                event.component.endSearch();
                event.component.enableInfiniteScroll();
                this.ref.detectChanges();
            }, error => {
                console.log('API error while retrieving list of companies.');
                console.log(error);
            });
            return;
        }
        this.searchListOfCompaniesSubscription = this.companyControllerService.filterCompanies(
            this.currentCompanyPageNumber,
            this.currentCompanyPageSize,
            text
        ).subscribe(resp => {
            if (this.searchListOfCompaniesSubscription.closed) {
                return;
            }
            if (resp.code === 200) {
                this.listOfCompanies = this.filterCompanies(resp.data, text);
            }
            event.component.endSearch();
            event.component.enableInfiniteScroll();
            this.ref.detectChanges();
        }, error => {
            console.log('API Error while retrieving filtered company list, error: ' + error);
        });
    }

    retrieveMoreCompanies(event: {
        component: IonicSelectableComponent,
        text: string
    }) {
        const text = (event.text || '').trim().toLowerCase();
        if (this.currentCompanyPageNumber > this.companyMaximumPages) {
            // event.component.disableInfiniteScroll();
            event.component.endInfiniteScroll();
            return;
        } else {
            this.currentCompanyPageNumber++;
            if (text) {
                this.appendListOfCompaniesSubscription = this.companyControllerService.filterCompanies(
                    this.currentCompanyPageNumber,
                    this.currentCompanyPageSize,
                    text
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const company of resp.data) {
                            this.listOfCompanies.push(company);
                        }
                    }
                    event.component.items = this.listOfCompanies;
                    event.component.endInfiniteScroll();
                    this.ref.detectChanges();
                }, error => {
                    event.component.endInfiniteScroll();
                });
            } else {
                this.appendListOfCompaniesSubscription = this.companyControllerService.getCompanies(
                    this.currentCompanyPageNumber,
                    this.currentCompanyPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const company of resp.data) {
                            this.listOfCompanies.push(company);
                        }
                    }
                    event.component.items = this.listOfCompanies;
                    event.component.endInfiniteScroll();
                    this.ref.detectChanges();
                }, error => {
                    console.log('API error while retrieving list of companies, error: ' + error);
                    event.component.endInfiniteScroll();
                });
            }
        }
    }

    createBlogger() {
        if (this.blogInfoFormGroup.valid) {
            this.loadingService.present();
            this.createNewBlogSubscription = this.bloggerControllerService.createBlogger(
                this.blogNameModel,
                this.selectedBlogBelongsToCompanyFlag === true ? 1 : 0,
                this.selectedCompany ? this.selectedCompany.id : null,
                this.blogDescriptionModel,
                this.blogEmailModel,
                this.blogImageAsBlobArray
            ).subscribe(resp => {
                if (resp.code === 200) {
                    this.globalFunctionService.simpleToast('SUCCESS', 'Blogger has been successfully created!', 'success', 'top');
                    this.closeCreateBlogModal(true);
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Blogger, please try again later!', 'warning', 'top');
                }
                this.loadingService.dismiss();
                this.ref.detectChanges();
            }, error => {
                console.log('API Error while creating a new Blogger.');
                console.log(error);
                this.loadingService.dismiss();
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Blogger, please try again later!', 'warning', 'top');
                this.ref.detectChanges();
            });
        }
    }
}
