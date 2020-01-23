import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Company, CompanyControllerServiceService, Store, StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {IonicSelectableComponent} from 'ionic-selectable';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';

@Component({
  selector: 'app-edit-store-modal',
  templateUrl: './edit-store-modal.page.html',
  styleUrls: ['./edit-store-modal.page.scss'],
})

export class EditStoreModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedStoreUid: string;
  phoneNumberRegex = commonConfig.phoneNumberRegex;

  // Numbers
  currentPageNumber = 1;
  currentPageSize = commonConfig.currentPageSize;
  maximumPages: number;
  storeNameMinLength = commonConfig.storeNameMinLength;
  storeNameMaxLength = commonConfig.storeNameMaxLength;
  storeContactNumMinLength = commonConfig.storeContactNumMinLength;
  storeContactNumMaxLength = commonConfig.storeContactNumMaxLength;
  storeDescriptionMinLength = commonConfig.storeDescriptionMinLength;
  storeDescriptionMaxLength = commonConfig.storeDescriptionMaxLength;
  storeNoStreetNameMaxLength = commonConfig.storeNoStreetNameMaxLength;
  storePostCodeMinLength = commonConfig.storePostCodeMinLength;
  storePostCodeMaxLength = commonConfig.storePostCodeMaxLength;
  storeCountryMaxLength = commonConfig.storeCountryMaxLength;
  storeStateMaxLength = commonConfig.storeStateMaxLength;
  storeCityMaxLength = commonConfig.storeCityMaxLength;

  // Booleans
  isLoadingStoreInfo = true;
  companyBelongingsFlag = false;

  // Arrays
  storeImageAsBlobArray: Array<Blob> = [];
  listOfCompanies: Array<Company> = [];

  // ViewChilds
  @ViewChild('storeImageContainer', {static: false}) storeImageContainer: ElementRef;

  // Objects
  selectedStore: Store;
  temporaryStoreImageURL: Blob;

  // FormGroups
  storeInfoFormGroup: FormGroup;

  // Subscriptions
  getStoreByUidSubscription: any;
  updateStoreSubscription: any;
  searchListOfCompaniesSubscription: any;
  appendListOfCompaniesSubscription: any;

  constructor(
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private companyControllerService: CompanyControllerServiceService,
      private storeControllerService: StoreControllerServiceService,
      private globalFunctionService: GlobalfunctionService,
      private ref: ChangeDetectorRef
  ) {
    console.log(this.constructorName + 'Initializing component');
    this.loadingService.present();
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.storeInfoFormGroup = new FormGroup({
        storeName: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.storeNameMinLength),
          Validators.maxLength(this.storeNameMaxLength)
        ]),
        storeContactNum: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.storeContactNumMinLength),
          Validators.maxLength(this.storeContactNumMaxLength),
          Validators.pattern(this.phoneNumberRegex)
        ]),
        storeEmail: new FormControl(null, [
          Validators.required,
          Validators.email
        ]),
        storeDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.storeDescriptionMinLength),
          Validators.maxLength(this.storeDescriptionMaxLength)
        ]),
        noStreetName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.storeNoStreetNameMaxLength)
        ]),
        storePostCode: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.storePostCodeMinLength),
          Validators.maxLength(this.storePostCodeMaxLength)
        ]),
        storeCountry: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.storeCountryMaxLength)
        ]),
        storeState: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.storeStateMaxLength)
        ]),
        storeCity: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.storeCityMaxLength)
        ]),
        storeCompanyBelongings: new FormControl(),
        storeSelectedStore: new FormControl()
      });
      this.getStoreByUidSubscription = this.storeControllerService.getStoreByUid(
          this.selectedStoreUid
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.selectedStore = resp.data;
          this.companyBelongingsFlag = resp.data.companyBelongings === 1;
        } else {
          this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Store\'s info, please try again later!', 'warning', 'top');
          this.closeEditStoreModal(false);
        }
        this.isLoadingStoreInfo = false;
        this.loadingService.dismiss();
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while retrieving store by uid.');
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Store\'s info, please try again later!', 'warning', 'top');
        this.isLoadingStoreInfo = false;
        this.loadingService.dismiss();
        this.closeEditStoreModal(false);
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
      if (this.getStoreByUidSubscription) {
        this.getStoreByUidSubscription.unsubscribe();
      }
      if (this.updateStoreSubscription) {
        this.updateStoreSubscription.unsubscribe();
      }
      if (this.searchListOfCompaniesSubscription) {
        this.searchListOfCompaniesSubscription.unsubscribe();
      }
      if (this.appendListOfCompaniesSubscription) {
        this.appendListOfCompaniesSubscription.unsubscribe();
      }
    });
  }

  closeEditStoreModal(returnFromEditingStore: boolean) {
    this.modalController.dismiss(returnFromEditingStore);
  }

  openStoreImageFilePicker() {
    this.storeImageContainer.nativeElement.click();
  }

  uploadStoreImage(event) {
    event.preventDefault();
    this.loadingService.present();
    setTimeout(() => {
      const files = event.target.files;
      if (files.length) {
        if (files[0].type.toString().includes('image')) {
          // Actual Blob File
          this.storeImageAsBlobArray[0] = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Some URL for displaying purpose only
            this.temporaryStoreImageURL = e.target.result;
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

  updateStore() {
    if (this.storeInfoFormGroup.valid) {
      this.loadingService.present();
      this.updateStoreSubscription = this.storeControllerService.updateStoreByUid(
          this.selectedStore.uid,
          this.selectedStore.name,
          this.companyBelongingsFlag ? 1 : 0,
          this.companyBelongingsFlag ? this.selectedStore.company.id : null,
          null,
          this.selectedStore.desc,
          this.selectedStore.contact,
          this.selectedStore.email,
          this.selectedStore.address,
          this.selectedStore.postcode,
          this.selectedStore.state,
          this.selectedStore.city,
          this.selectedStore.country,
          'PUT',
          this.storeImageAsBlobArray[0] !== undefined || this.storeImageAsBlobArray[0] !== null ? this.storeImageAsBlobArray : null
      ).subscribe(resp => {
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'Store has been updated.', 'success', 'top');
          this.closeEditStoreModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Store, please try again later!', 'danger', 'top');
        }
        this.loadingService.dismiss();
      }, error => {
        console.log('API Error while updating store');
        this.loadingService.dismiss();
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update the Store, please try again later!', 'danger', 'top');
      });
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
      this.temporaryStoreImageURL = null;
      this.storeImageAsBlobArray = [];
      this.loadingService.dismiss();
    }, 500);
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
}
