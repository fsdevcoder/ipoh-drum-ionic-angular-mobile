import {ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {commonConfig} from '../../../_dal/common/commonConfig';
import {Channel, ChannelControllerServiceService, Company, CompanyControllerServiceService} from '../../../_dal/ipohdrum';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {ModalController} from '@ionic/angular';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-edit-channel-modal',
  templateUrl: './edit-channel-modal.page.html',
  styleUrls: ['./edit-channel-modal.page.scss'],
})

export class EditChannelModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  phoneNumberRegex = commonConfig.phoneNumberRegex;
  selectedChannelUid: string;

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

  // Booleans
  isLoadingChannelInfo = true;
  companyBelongingsFlag = false;

  // ViewChilds
  @ViewChild('channelImageContainer', {static: false}) channelImageContainer: ElementRef;

  // Arrays
  channelImageAsBlobArray: Array<Blob> = [];
  listOfCompanies: Array<Company> = [];

  // Objects
  selectedChannel: Channel;
  temporaryChannelImageURL: Blob;

  // FormGroups
  channelInfoFormGroup: FormGroup;

  // Subscriptions
  getChannelSubscription: any;
  updateChannelSubscription: any;
  searchListOfCompaniesSubscription: any;
  appendListOfCompaniesSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private globalFunctionService: GlobalfunctionService,
      private modalController: ModalController,
      private loadingService: LoadingService,
      private companyControllerService: CompanyControllerServiceService,
      private channelControllerService: ChannelControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
    this.loadingService.present();
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
        ]),
        channelCompanyBelongings: new FormControl(),
        channelSelectedCompany: new FormControl()
      });
      this.retrieveSelectedChannel();
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
      if (this.updateChannelSubscription) {
        this.updateChannelSubscription.unsubscribe();
      }
      if (this.getChannelSubscription) {
        this.getChannelSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedChannel() {
    this.isLoadingChannelInfo = true;
    if (this.getChannelSubscription) {
      this.getChannelSubscription.unsubscribe();
    }
    this.getChannelSubscription = this.channelControllerService.getChannelByUid(
        this.selectedChannelUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedChannel = resp.data;
        this.companyBelongingsFlag = resp.data.companyBelongings === 1;
      } else {
        // tslint:disable-next-line:max-line-length
        this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channel\'s info, please try again later!', 'warning', 'top');
        this.closeEditChannelModal(false);
      }
      this.isLoadingChannelInfo = false;
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving Channel by uid.');
      console.log(error);
      this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Channel\'s info, please try again later!', 'warning', 'top');
      this.isLoadingChannelInfo = false;
      this.loadingService.dismiss();
      this.closeEditChannelModal(false);
      this.ref.detectChanges();
    });
  }

  closeEditChannelModal(returnFromEditingChannel: boolean) {
    this.modalController.dismiss(returnFromEditingChannel);
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
      console.log('API Error while retrieving filtered company list.');
      console.log(error);
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
          console.log('API error while retrieving list of companies.');
          console.log(error);
          event.component.endInfiniteScroll();
        });
      }
    }
  }

  resetUploadedTempPhoto() {
    this.globalFunctionService.presentAlertConfirm(
        'Warning',
        'Are you sure you want to reset the uploaded Channel photo?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.resetChannelPhoto());
  }

  resetChannelPhoto() {
    this.loadingService.present();
    setTimeout(() => {
      this.temporaryChannelImageURL = null;
      this.channelImageAsBlobArray = [];
      this.loadingService.dismiss();
    }, 500);
  }

  updateChannel() {
    if (this.channelInfoFormGroup.valid) {
      this.loadingService.present();
      this.updateChannelSubscription = this.channelControllerService.updateChannelByUid(
          this.selectedChannelUid,
          this.selectedChannel.name,
          this.companyBelongingsFlag ? 1 : 0,
          null,
          this.companyBelongingsFlag ? this.selectedChannel.company.id : null,
          this.selectedChannel.desc,
          this.selectedChannel.email,
          this.selectedChannel.tel1,
          'PUT',
          this.channelImageAsBlobArray[0] !== undefined || this.channelImageAsBlobArray[0] !== null ? this.channelImageAsBlobArray : null
      ).subscribe(resp => {
        console.log(resp);
        if (resp.code === 200) {
          this.globalFunctionService.simpleToast('SUCCESS', 'Channel has been updated.', 'success', 'top');
          this.closeEditChannelModal(true);
        } else {
          this.globalFunctionService.simpleToast('ERROR', 'Unable to update Channel, please try again later!', 'danger', 'top');
        }
        this.loadingService.dismiss();
        this.ref.detectChanges();
      }, error => {
        console.log('API Error while updating the Channel by uid.');
        console.log(error);
        this.globalFunctionService.simpleToast('ERROR', 'Unable to update Channel, please try again later!', 'danger', 'top');
        this.loadingService.dismiss();
        this.ref.detectChanges();
      });
    }
  }
}
