import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../../_dal/common/services/globalfunction.service';
import {LoadingService} from '../../../_dal/common/services/loading.service';
import {Article, BloggerControllerServiceService} from '../../../_dal/ipohdrum';
import {CreateArticleModalPage} from './create-article-modal/create-article-modal.page';
import {ViewArticleModalPage} from './view-article-modal/view-article-modal.page';
import {commonConfig} from '../../../_dal/common/commonConfig';

@Component({
    selector: 'app-article-management-modal',
    templateUrl: './article-management-modal.page.html',
    styleUrls: ['./article-management-modal.page.scss'],
})

export class ArticleManagementModalPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    selectedBloggerUid: string;

    // Numbers
    selectedBloggerId: number;
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Arrays
    listOfArticlesByBloggerUid: Array<Article> = [];

    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    getListOfArticlesByBloggerUidSubscription: any;
    appendListOfArticlesByBloggerUidSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private loadingService: LoadingService,
        private bloggerControllerService: BloggerControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveListOfArticlesByBloggerUid();
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
            if (this.getListOfArticlesByBloggerUidSubscription) {
                this.getListOfArticlesByBloggerUidSubscription.unsubscribe();
            }
        });
    }

    closeArticleManagementModal() {
        this.modalController.dismiss();
    }

    async openCreateArticleModal() {
        const modal = await this.modalController.create({
            component: CreateArticleModalPage,
            componentProps: {
                selectedBloggerUid: this.selectedBloggerUid,
                selectedBloggerId: this.selectedBloggerId
            }
        });
        modal.onDidDismiss().then((returnedFromCreatingArticle) => {
            if (returnedFromCreatingArticle.data) {
                this.retrieveListOfArticlesByBloggerUid();
                if (this.referInfiniteScroll) {
                    this.referInfiniteScroll.target.disabled = false;
                }
            }
        });
        return await modal.present();
    }

    async openViewArticleModal(selectedArticleId: number, selectedArticleUid: string) {
        const modal = await this.modalController.create({
            component: ViewArticleModalPage,
            componentProps: {
                selectedArticleId,
                selectedArticleUid,
                selectedBloggerId: this.selectedBloggerId
            }
        });
        modal.onDidDismiss().then((returnedFromEditingArticle) => {
            if (returnedFromEditingArticle.data) {
                this.retrieveListOfArticlesByBloggerUid();
                if (this.referInfiniteScroll) {
                    this.referInfiniteScroll.target.disabled = false;
                }
            }
        });
        return await modal.present();
    }

    retrieveListOfArticlesByBloggerUid() {
        this.loadingService.present();
        if (this.getListOfArticlesByBloggerUidSubscription) {
            this.getListOfArticlesByBloggerUidSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfArticlesByBloggerUidSubscription = this.bloggerControllerService.getArticlesByBloggerUid(
            this.selectedBloggerUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            console.log(resp);
            if (resp.code === 200) {
                this.listOfArticlesByBloggerUid = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfArticlesByBloggerUid = [];
                this.maximumPages = 0;
                this.totalResult = 0;
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Articles, please try again later!', 'warning', 'top');
            }
            this.loadingService.dismiss();
            this.ref.detectChanges();
        }, error => {
            console.log('API Error while retrieving list of Articles by Blogger Uid.');
            console.log(error);
            this.listOfArticlesByBloggerUid = [];
            this.loadingService.dismiss();
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Articles, please try again later!', 'warning', 'top');
            this.ref.detectChanges();
        });
    }

    loadMoreArticlesByBloggerUid(event) {
        this.referInfiniteScroll = event;
        setTimeout(() => {
            if (this.maximumPages > this.currentPageNumber) {
                this.currentPageNumber++;
                this.appendListOfArticlesByBloggerUidSubscription = this.bloggerControllerService.getArticlesByBloggerUid(
                    this.selectedBloggerUid,
                    this.currentPageNumber,
                    this.currentPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const tempArticles of resp.data) {
                            this.listOfArticlesByBloggerUid.push(tempArticles);
                        }
                    }
                    this.ref.detectChanges();
                    this.referInfiniteScroll.target.complete();
                }, error => {
                    console.log('API Error while retrieving list of Articles by blogger uid.');
                    console.log(error);
                    this.referInfiniteScroll.target.complete();
                });
            }
            if (this.totalResult === this.listOfArticlesByBloggerUid.length) {
                this.referInfiniteScroll.target.disabled = true;
            }
        }, 500);
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        if (this.getListOfArticlesByBloggerUidSubscription) {
            this.getListOfArticlesByBloggerUidSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfArticlesByBloggerUidSubscription = this.bloggerControllerService.getArticlesByBloggerUid(
            this.selectedBloggerUid,
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfArticlesByBloggerUid = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Articles, please try again later!', 'warning', 'top');
                this.listOfArticlesByBloggerUid = [];
            }
            this.ref.detectChanges();
            event.target.complete();
        }, error => {
            console.log('API Error while retrieving list of Articles by blogger uid.');
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Articles, please try again later!', 'warning', 'top');
            this.listOfArticlesByBloggerUid = [];
            event.target.complete();
        });
    }
}
