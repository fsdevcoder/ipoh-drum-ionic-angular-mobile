import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CompanyControllerServiceService, StoreControllerServiceService} from '../../../_dal/ipohdrum';
import {Company} from '../../../_dal/ipohdrum';
import {IonicSelectableComponent} from 'ionic-selectable';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';

@Component({
  selector: 'app-add-store-modal',
  templateUrl: './add-store-modal.page.html',
  styleUrls: ['./add-store-modal.page.scss'],
})

export class AddStoreModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  temporaryStoreImageURL: string;
  phoneNumberRegex = commonConfig.phoneNumberRegex;

  // NgModels
  selectedStoreBelongsToCompanyFlag = false;
  selectedCompany: Company;
  storeNameModel: string;
  storeContactNumModel: string;
  storeEmailModel: string;
  storeDescriptionModel: string;
  storeNoStreetNameModel: string;
  storePostCodeModel: string;
  storeCountryModel: string;
  storeStateModel: string;
  storeCityModel: string;

  // Numbers
  currentCompanyPageNumber = 1;
  currentCompanyPageSize = 10;
  companyMaximumPages: number;
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

  // Arrays
  listOfCompanies: Array<Company> = [];
  storeImageAsBlobArray: Array<Blob> = [];

  // ViewChilds
  @ViewChild('storeImageContainer', {static: false}) storeImageContainer: ElementRef;

  // Objects
  inventoryImageSliderOptions = {
    autoHeight: true,
    initialSlide: 0,
    speed: 400,
    noSwipingClass: 'no-swipe'
  };

  // FormGroup
  storeInfoFormGroup: FormGroup;
  storeAddressFormGroup: FormGroup;

  // Subscriptions
  appendListOfCompaniesSubscription: any;
  searchListOfCompaniesSubscription: any;
  createStoreSubscription: any;

  constructor(
      private ngZone: NgZone,
      private modalController: ModalController,
      private companyControllerService: CompanyControllerServiceService,
      private storeControllerService: StoreControllerServiceService,
      private loadingService: LoadingService,
      private globalFunctionService: GlobalfunctionService,
      private ref: ChangeDetectorRef
  ) {
    console.log(this.constructorName + 'Initializing component');
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
        ])
      });
      this.storeAddressFormGroup = new FormGroup({
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
      if (this.searchListOfCompaniesSubscription) {
        this.searchListOfCompaniesSubscription.unsubscribe();
      }
      if (this.createStoreSubscription) {
        this.createStoreSubscription.unsubscribe();
      }
    });
  }

  closeCreateStoreModal(returnFromCreatingStore: boolean) {
    this.modalController.dismiss(returnFromCreatingStore);
  }

  toggleBelongsToCompanyFlag() {
    this.selectedStoreBelongsToCompanyFlag = !this.selectedStoreBelongsToCompanyFlag;
    if (!this.selectedStoreBelongsToCompanyFlag) {
      this.selectedCompany = null;
    }
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

  createStore() {
    this.loadingService.present();
    this.createStoreSubscription = this.storeControllerService.createStore(
        this.storeNameModel,
        this.selectedStoreBelongsToCompanyFlag === true ? 1 : 0,
        this.selectedCompany ? this.selectedCompany.id : null,
        null,
        this.storeContactNumModel,
        this.storeDescriptionModel,
        this.storeEmailModel,
        this.storeNoStreetNameModel,
        this.storePostCodeModel,
        this.storeStateModel,
        this.storeCityModel,
        this.storeCountryModel,
        this.storeImageAsBlobArray
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'Store has been successfully created!', 'success', 'top');
        this.closeCreateStoreModal(true);
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Store, please try again later!', 'warning', 'top');
      }
      this.loadingService.dismiss();
    }, error => {
      console.log('API Error while creating a new store.');
      // tslint:disable-next-line:max-line-length
      this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Store, please try again later!', 'warning', 'top');
      this.loadingService.dismiss();
    });
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
}
