import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ChannelControllerServiceService, Company, CompanyControllerServiceService} from '../../../_dal/ipohdrum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.page.html',
  styleUrls: ['./add-channel-modal.page.scss'],
})

export class AddChannelModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  temporaryChannelImageURL: string;
  phoneNumberRegex = commonConfig.phoneNumberRegex;

  // NgModels
  selectedChannelBelongsToCompanyFlag = false;
  selectedCompany: Company;
  channelNameModel: string;
  channelDescriptionModel: string;
  channelContactNumModel: string;
  channelEmailModel: string;

  // Numbers
  currentCompanyPageNumber = 1;
  currentCompanyPageSize = 10;
  companyMaximumPages: number;
  channelNameMinLength = commonConfig.channelNameMinLength;
  channelNameMaxLength = commonConfig.channelNameMaxLength;
  channelDescriptionMinLength = commonConfig.channelDescriptionMinLength;
  channelDescriptionMaxLength = commonConfig.channelDescriptionMaxLength;
  channelContactNumMinLength = commonConfig.channelContactNumMinLength;
  channelContactNumMaxLength = commonConfig.channelContactNumMaxLength;

  // Arrays
  listOfCompanies: Array<Company> = [];
  channelImageAsBlobArray: Array<Blob> = [];

  // ViewChilds
  @ViewChild('channelImageContainer', {static: false}) channelImageContainer: ElementRef;

  // Objects
  articleImageSliderOptions = {
    autoHeight: true,
    initialSlide: 0,
    speed: 400,
    noSwipingClass: 'no-swipe'
  };

  // FormGroups
  channelInfoFormGroup: FormGroup;

  // Subscriptions
  appendListOfCompaniesSubscription: any;
  searchListOfCompaniesSubscription: any;
  createNewChannelSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private channelControllerService: ChannelControllerServiceService,
      private companyControllerService: CompanyControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.channelInfoFormGroup = new FormGroup({
        channelName: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.channelNameMinLength),
          Validators.maxLength(this.channelNameMaxLength)
        ]),
        channelDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.channelDescriptionMinLength),
          Validators.maxLength(this.channelDescriptionMaxLength)
        ]),
        channelContactNum: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.channelContactNumMinLength),
          Validators.maxLength(this.channelContactNumMaxLength),
          Validators.pattern(this.phoneNumberRegex)
        ]),
        channelEmail: new FormControl(null, [
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
      if (this.createNewChannelSubscription) {
        this.createNewChannelSubscription.unsubscribe();
      }
      if (this.searchListOfCompaniesSubscription) {
        this.searchListOfCompaniesSubscription.unsubscribe();
      }
    });
  }

  closeCreateChannelModal(returnFromCreatingChannel: boolean) {
    this.modalController.dismiss(returnFromCreatingChannel);
  }

  openChannelImageFilePicker() {
    this.channelImageContainer.nativeElement.click();
  }

  uploadChannelImage(event) {
    event.preventDefault();
    this.loadingService.present();
    setTimeout(() => {
      const files = event.target.files;
      if (files.length) {
        if (files[0].type.toString().includes('image')) {
          // Actual Blob File
          this.channelImageAsBlobArray[0] = event.target.files[0];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // Some URL for displaying purpose only
            this.temporaryChannelImageURL = e.target.result;
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

  toggleBelongsToCompanyFlag() {
    this.selectedChannelBelongsToCompanyFlag = !this.selectedChannelBelongsToCompanyFlag;
    if (!this.selectedChannelBelongsToCompanyFlag) {
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

  createChannel() {
    if (this.channelInfoFormGroup.valid) {
      this.loadingService.present();
      this.createNewChannelSubscription = this.channelControllerService.createChannel(
          this.channelNameModel,
          this.selectedChannelBelongsToCompanyFlag === true ? 1 : 0,
          this.selectedCompany ? this.selectedCompany.id : null,
          this.channelDescriptionModel,
          this.channelEmailModel,
          this.channelContactNumModel,
          this.channelImageAsBlobArray
      ).subscribe(resp => {
        console.log(resp);
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'Channel has been successfully created!', 'success', 'top');
          this.closeCreateChannelModal(true);
        } else {
          // tslint:disable-next-line:max-line-length
          this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Channel, please try again later!', 'warning', 'top');
        }
        this.loadingService.dismiss();
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while creating a new Channel.');
        console.log(error);
        this.loadingService.dismiss();
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('ERROR', 'Something went wrong while creating the Channel, please try again later!', 'warning', 'top');
        this.ref.detectChanges();
      });
    }
  }
}
