import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Article, ArticleControllerServiceService} from '../../../../_dal/ipohdrum';
import {GlobalfunctionService} from '../../../../_dal/common/services/globalfunction.service';
import {EditArticleModalPage} from '../edit-article-modal/edit-article-modal.page';
import {LoadingService} from '../../../../_dal/common/services/loading.service';

@Component({
  selector: 'app-view-article-modal',
  templateUrl: './view-article-modal.page.html',
  styleUrls: ['./view-article-modal.page.scss'],
})

export class ViewArticleModalPage implements OnInit, OnDestroy {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedArticleUid: string;

  // Numbers
  selectedArticleId: number;
  selectedBloggerId: number;

  // Booleans
  isLoadingArticleInfo = true;
  isArticlePublicScope = false;

  // Objects
  selectedArticle: Article;
  articleImageSliderOptions = {
    autoHeight: true,
    initialSlide: 0,
    speed: 400
  };

  // Subscriptions
  getSelectedArticleByUidSubscription: any;
  deleteArticleSubscription: any;

  constructor(
      private ref: ChangeDetectorRef,
      private ngZone: NgZone,
      private loadingService: LoadingService,
      private modalController: ModalController,
      private globalFunctionService: GlobalfunctionService,
      private articleControllerService: ArticleControllerServiceService
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
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
      if (this.getSelectedArticleByUidSubscription) {
        this.getSelectedArticleByUidSubscription.unsubscribe();
      }
      if (this.deleteArticleSubscription) {
        this.deleteArticleSubscription.unsubscribe();
      }
    });
  }

  retrieveSelectedArticleByUid() {
    this.isLoadingArticleInfo = true;
    if (this.getSelectedArticleByUidSubscription) {
      this.getSelectedArticleByUidSubscription.unsubscribe();
    }
    this.getSelectedArticleByUidSubscription = this.articleControllerService.getArticleByUid(
        this.selectedArticleUid
    ).subscribe(resp => {
      console.log(resp);
      if (resp.code === 200) {
        this.selectedArticle = resp.data;
        this.selectedArticle.scope === 'public' ? this.isArticlePublicScope = true : this.isArticlePublicScope = false;
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Article info, please try again later!', 'danger');
        this.closeViewArticleModal();
      }
      this.isLoadingArticleInfo = false;
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while retrieving selected Article by uid.');
      console.log(error);
      this.isLoadingArticleInfo = false;
      this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve Article info, please try again later!', 'danger');
      this.closeViewArticleModal();
      this.ref.detectChanges();
    });
  }

  closeViewArticleModal() {
    this.modalController.dismiss();
  }

  async openEditArticleModal() {
    const modal = await this.modalController.create({
      component: EditArticleModalPage,
      componentProps: {
        selectedArticleId: this.selectedArticleId,
        selectedArticleUid: this.selectedArticleUid,
        selectedBloggerId: this.selectedBloggerId
      }
    });
    modal.onDidDismiss().then((returnFromEditingArticle) => {
      if (returnFromEditingArticle.data) {
        this.retrieveSelectedArticleByUid();
      }
    });
    return await modal.present();
  }

  deleteArticle() {
    this.globalFunctionService.presentAlertConfirm(
        'WARNING',
        'Are you sure you want to delete the selected Article?',
        'Cancel',
        'Confirm',
        undefined,
        () => this.actuallyDeleteArticle()
    );
  }

  actuallyDeleteArticle() {
    this.loadingService.present();
    if (this.deleteArticleSubscription) {
      this.deleteArticleSubscription.unsubscribe();
    }
    this.deleteArticleSubscription = this.articleControllerService.deleteArticleByUid(
        this.selectedArticleUid
    ).subscribe(resp => {
      if (resp.code === 200) {
        this.globalFunctionService.simpleToast('SUCCESS', 'The Article has been deleted!', 'success');
        this.closeViewArticleModal();
      } else {
        this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Article, please try again later!', 'danger');
      }
      this.loadingService.dismiss();
      this.ref.detectChanges();
    }, error => {
      console.log('API Error while deleting the Article');
      console.log(error);
      this.loadingService.dismiss();
      this.globalFunctionService.simpleToast('ERROR', 'Unable to delete the Article, please try again later!', 'danger');
      this.ref.detectChanges();
    });
  }
}
