import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {BloggerControllerServiceService, Company, CompanyControllerServiceService} from '../../../_dal/ipohdrum';
import {Blogger} from '../../../_dal/ipohdrum/model/blogger';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-edit-blog-modal',
  templateUrl: './edit-blog-modal.page.html',
  styleUrls: ['./edit-blog-modal.page.scss'],
})

export class EditBlogModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedBloggerUid: string;

  // Numbers
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  totalResult: number;
  blogNameMinLength = commonConfig.blogNameMinLength;
  blogNameMaxLength = commonConfig.blogNameMaxLength;
  blogDescriptionMinLength = commonConfig.blogDescriptionMinLength;
  blogDescriptionMaxLength = commonConfig.blogDescriptionMaxLength;

  // Booleans
  isLoadingBloggerInfo = true;
  companyBelongingsFlag = false;

  // ViewChilds
  @ViewChild('bloggerImageContainer', {static: false}) bloggerImageContainer: ElementRef;

  // Arrays
  bloggerImageAsBlobArray: Array<Blob> = [];
  listOfCompanies: Array<Company> = [];

  // Objects
  selectedBlogger: Blogger;
  temporaryBlogImageUrl: Blob;

  // FormGroups
  blogInfoFormGroup: FormGroup;

  // Subscriptions
  getBloggerSubscription: any;
  updateBloggerSubscription: any;
  searchListOfCompaniesSubscription: any;
  appendListOfCompaniesSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private globalFunctionService: GlobalfunctionService,
      private modalController: ModalController,
      private loadingService: LoadingService,
      private companyControllerService: CompanyControllerServiceService,
      private bloggerControllerService: BloggerControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
    this.loadingService.present();
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
        ]),
        blogCompanyBelongings: new FormControl(),
        blogSelectedCompany: new FormControl()
      });
      this.retrieveSelectedBlog();
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
      if (this.updateBloggerSubscription) {
        this.updateBloggerSubscription.unsubscribe();
      }
      if (this.getBloggerSubscription) {
        this.getBloggerSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedBlog() {
    this.isLoadingBloggerInfo = true;
    if (this.getBloggerSubscription) {
      this.getBloggerSubscription.unsubscribe();
    }
    this.getBloggerSubscription = this.bloggerControllerService.getBloggerByUid(
        this.selectedBloggerUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedBlogger = resp.data;
        this.companyBelongingsFlag = resp.data.companyBelongings === 1;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogger\'s info, please try again later!', 'warning', 'top');
        this.closeEditBlogModal(false);
      }
      this.isLoadingBloggerInfo = false;
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving Blogger by uid.');
      console.log(error);
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogger\'s info, please try again later!', 'warning', 'top');
      this.isLoadingBloggerInfo = false;
      this.loadingService.dismiss();
      this.closeEditBlogModal(false);
      this.ref.detectChanges();
    });
  }

  closeEditBlogModal(returnFromEditingBlog: boolean) {
    this.modalController.dismiss(returnFromEditingBlog);
  }

  openBloggerImageFilePicker() {
    this.bloggerImageContainer.nativeElement.click();
  }

  uploadBloggerImage(event) {
    event.preventDefault();
    this.loadingService.present();
    setTimeout(() => {
      const files = event.target.files;
      if (files.length) {
        if (files[0].type.toString().includes('image')) {
          // Actual Blob File
          this.bloggerImageAsBlobArray[0] = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Some URL for displaying purpose only
            this.temporaryBlogImageUrl = e.target.result;
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

  resetUploadedTempPhoto() {
    this.globalFunctionService.presentAlertConfirm(
        'Warning',
        'Are you sure you want to reset the uploaded photo?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.resetPhoto());
  }

  resetPhoto() {
    this.loadingService.present();
    setTimeout(() => {
      this.temporaryBlogImageUrl = null;
      this.bloggerImageAsBlobArray = [];
      this.loadingService.dismiss();
    }, 500);
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
    this.currentPageNumber = 1;
    if (!text) {
      if (this.searchListOfCompaniesSubscription) {
        this.searchListOfCompaniesSubscription.unsubscribe();
      }
      this.searchListOfCompaniesSubscription = this.companyControllerService.getCompanies(
          this.currentPageNumber,
          this.currentPageSize
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.listOfCompanies = resp.data;
          this.maximumPages = resp.maximumPages;
          event.component.items = this.listOfCompanies;
        } else {
          this.listOfCompanies = [];
          this.maximumPages = 0;
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
        this.currentPageNumber,
        this.currentPageSize,
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
      console.log('API Error while retrieving filtered company list.');
      console.log(error);
    });
  }

  retrieveMoreCompanies(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = (event.text || '').trim().toLowerCase();
    if (this.currentPageNumber > this.maximumPages) {
      // event.component.disableInfiniteScroll();
      event.component.endInfiniteScroll();
      return;
    } else {
      this.currentPageNumber++;
      if (text) {
        this.appendListOfCompaniesSubscription = this.companyControllerService.filterCompanies(
            this.currentPageNumber,
            this.currentPageSize,
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
            this.currentPageNumber,
            this.currentPageSize
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
          console.log('API error while retrieving list of companies.');
          console.log(error);
          event.component.endInfiniteScroll();
        });
      }
    }
  }

  updateBlogger() {
    if (this.blogInfoFormGroup.valid) {
      this.loadingService.present();
      this.updateBloggerSubscription = this.bloggerControllerService.updateBloggerByUid(
          this.selectedBloggerUid,
          this.selectedBlogger.name,
          this.companyBelongingsFlag ? 1 : 0,
          null,
          this.companyBelongingsFlag ? this.selectedBlogger.company.id : null,
          this.selectedBlogger.desc,
          this.selectedBlogger.email,
          null,
          'PUT',
          this.bloggerImageAsBlobArray[0] !== undefined || this.bloggerImageAsBlobArray[0] !== null ? this.bloggerImageAsBlobArray : null
      ).subscribe(resp => {
        console.log(resp);
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'Blogger has been updated.', 'success', 'top');
          this.closeEditBlogModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Blogger, please try again later!', 'danger', 'top');
        }
        this.loadingService.dismiss();
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while updating the Blogger by uid.');
        console.log(error);
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Blogger, please try again later!', 'danger', 'top');
        this.loadingService.dismiss();
        this.ref.detectChanges();
      });
    }
  }
}
