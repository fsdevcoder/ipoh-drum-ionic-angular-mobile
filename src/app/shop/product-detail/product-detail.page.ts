import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Inventory, InventoryControllerServiceService} from '../../_dal/ipohdrum';
import {ProductVariationModalPage} from './product-variation-modal/product-variation-modal.page';
import {ModalController} from '@ionic/angular';
import {GlobalfunctionService} from '../../_dal/common/services/globalfunction.service';
import {Location} from '@angular/common';
import {LoadingService} from '../../_dal/common/services/loading.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.page.html',
    styleUrls: ['./product-detail.page.scss'],
})

export class ProductDetailPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    inventoryUID: string;
    productFeatureTitleUid: string;

    // Booleans
    isLoadingInventory = true;
    comeFromShopPage = '';

    // Objects
    currentInventory: Inventory;
    ionSliderOptions = {
        autoHeight: true,
        initialSlide: 0,
        speed: 400
    };

    // Subscriptions
    currentInventorySubscription: any;

    constructor(
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private modalController: ModalController,
        private inventoryControllerService: InventoryControllerServiceService,
        private globalFunctionService: GlobalfunctionService,
        private loadingService: LoadingService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.retrieveSelectedInventoryInfo();
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
            if (this.currentInventorySubscription) {
                this.currentInventorySubscription.unsubscribe();
            }
        });
    }

    retrieveSelectedInventoryInfo() {
        this.loadingService.present();
        this.isLoadingInventory = true;
        this.route.params.subscribe(params => {
            console.log(params);
            let newParams = params.uid.toString().split('&');
            this.inventoryUID = newParams[0];
            if (newParams[1]) {
                this.comeFromShopPage = newParams[1];
            }
            if (newParams[2]) {
                this.productFeatureTitleUid = newParams[2];
            }
            if (this.currentInventorySubscription) {
                this.currentInventorySubscription.unsubscribe();
            }
            this.currentInventorySubscription = this.inventoryControllerService.getOnSaleInventoryByUid(
                this.inventoryUID.toString()
            ).subscribe(resp => {
                console.log(resp);
                if (resp.code === 200) {
                    this.currentInventory = resp.data;
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the selected Inventory info, please try again later!', 'danger');
                    this.backToShopPage();
                }
                this.loadingService.dismiss();
                this.isLoadingInventory = false;
            }, error => {
                console.log('cannot get item');
                this.isLoadingInventory = false;
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('ERROR', 'Unable to retrieve the selected Inventory info, please try again later!', 'danger');
                this.loadingService.dismiss();
                this.backToShopPage();
            });
        });
    }

    backToShopPage() {
        console.log(this.comeFromShopPage);
        if (this.comeFromShopPage === '1') {
            console.log('come from shop page');
            this.router.navigate(['ipoh-drum/shop']);
        } else {
            this.router.navigate(['ipoh-drum/shop/show-more-products', this.productFeatureTitleUid]).catch(reason => {
                console.log('Routing navigation failed');
                // tslint:disable-next-line:max-line-length
                this.globalFunctionService.simpleToast('DANGER', 'Something went wrong, please try again later.', 'warning', 'top');
                this.router.navigate(['/ipoh-drum/home']);
            });
        }
    }

    async openProductVariationsModal() {
        this.retrieveSelectedInventoryInfo();
        const modal = await this.modalController.create({
            component: ProductVariationModalPage,
            cssClass: 'dialog-modal',
            componentProps: {
                selectedInventory: this.currentInventory
            }
        });
        return await modal.present();
    }
}
