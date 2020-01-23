import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {BloggerControllerServiceService} from '../../_dal/ipohdrum';
import {Blogger} from '../../_dal/ipohdrum/model/blogger';
import {LoadingService} from '../../_dal/common/services/loading.service';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {AddBlogModalPage} from './add-blog-modal/add-blog-modal.page';
import {MainBlogManagementModalPage} from './main-blog-management-modal/main-blog-management-modal.page';
import {commonConfig} from '../../_dal/common/commonConfig';

@Component({
    selector: 'app-my-blog',
    templateUrl: './my-blog.page.html',
    styleUrls: ['./my-blog.page.scss'],
})

export class MyBlogPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';

    // Numbers
    currentPageNumber = 1;
    currentPageSize = commonConfig.currentPageSize;
    maximumPages: number;
    totalResult: number;

    // Arrays
    listOfCurrentUsersBlogs: Array<Blogger> = [];

    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    getListOfBloggersOfCurrentUserSubscription: any;
    appendListOfBloggersOfCurrentUserSubscription: any;

    constructor(
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
        private loadingService: LoadingService,
        private modalController: ModalController,
        private globalFunctionService: GlobalfunctionService,
        private bloggerControllerService: BloggerControllerServiceService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveListOfBlogsOfCurrentUsers();
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
            if (this.getListOfBloggersOfCurrentUserSubscription) {
                this.getListOfBloggersOfCurrentUserSubscription.unsubscribe();
            }
            if (this.appendListOfBloggersOfCurrentUserSubscription) {
                this.appendListOfBloggersOfCurrentUserSubscription.unsubscribe();
            }
        });
    }

    retrieveListOfBlogsOfCurrentUsers() {
        this.loadingService.present();
        if (this.getListOfBloggersOfCurrentUserSubscription) {
            this.getListOfBloggersOfCurrentUserSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfBloggersOfCurrentUserSubscription = this.bloggerControllerService.getBloggers(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfCurrentUsersBlogs = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfCurrentUsersBlogs = [];
                this.maximumPages = 0;
                this.totalResult = 0;
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogs list info, please try again later!', 'warning', 'top');
                console.log('Unable to retrieve list of Blogs');
            }
            this.loadingService.dismiss();
            this.ref.detectChanges();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogs list info, please try again later!', 'warning', 'top');
            this.listOfCurrentUsersBlogs = [];
            this.loadingService.dismiss();
            this.ref.detectChanges();
            console.log('API Error while retrieving list of bloggers of current user');
        });
    }

    async openCreateBlogModal() {
        const modal = await this.modalController.create({
           component: AddBlogModalPage
        });
        modal.onDidDismiss().then((returnFromCreatingBlog) => {
            if (returnFromCreatingBlog.data) {
                this.retrieveListOfBlogsOfCurrentUsers();
                if (this.referInfiniteScroll) {
                    this.referInfiniteScroll.target.disabled = false;
                }
            }
        });
        return await modal.present();
    }

    async openMainBlogManagementModal(selectedBloggerId: number, selectedBloggerUid: string) {
        const modal = await this.modalController.create({
            component: MainBlogManagementModalPage,
            cssClass: 'article-management-modal',
            componentProps: {
                selectedBloggerId,
                selectedBloggerUid
            }
        });
        return await modal.present();
    }

    loadMoreBlogs(event) {
        this.referInfiniteScroll = event;
        setTimeout(() => {
            if (this.maximumPages > this.currentPageNumber) {
                this.currentPageNumber++;
                this.appendListOfBloggersOfCurrentUserSubscription = this.bloggerControllerService.getBloggers(
                    this.currentPageNumber,
                    this.currentPageSize
                ).subscribe(resp => {
                    if (resp.code === 200) {
                        for (const tempBlogs of resp.data) {
                            this.listOfCurrentUsersBlogs.push(tempBlogs);
                        }
                    }
                    this.ref.detectChanges();
                    this.referInfiniteScroll.target.complete();
                }, error => {
                    console.log('API Error while retrieving list of Blogs of current User');
                    this.referInfiniteScroll.target.complete();
                });
            }
            if (this.totalResult === this.listOfCurrentUsersBlogs.length) {
                this.referInfiniteScroll.target.disabled = true;
            }
        }, 500);
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        if (this.getListOfBloggersOfCurrentUserSubscription) {
            this.getListOfBloggersOfCurrentUserSubscription.unsubscribe();
        }
        this.currentPageNumber = 1;
        this.getListOfBloggersOfCurrentUserSubscription = this.bloggerControllerService.getBloggers(
            this.currentPageNumber,
            this.currentPageSize
        ).subscribe(resp => {
            if (resp.code === 200) {
                this.listOfCurrentUsersBlogs = resp.data;
                this.maximumPages = resp.maximumPages;
                this.totalResult = resp.totalResult;
            } else {
                this.listOfCurrentUsersBlogs = [];
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogs list info, please try again later!', 'warning', 'top');
                console.log('Unable to retrieve list of Blogs');
            }
            this.ref.detectChanges();
            event.target.complete();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve Blogs list info, please try again later!', 'warning', 'top');
            this.listOfCurrentUsersBlogs = [];
            console.log('API Error while retrieving list of blogs of current User');
            event.target.complete();
        });
    }
}
