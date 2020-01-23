import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {
    InventoryControllerServiceService,
    TypeControllerServiceService,
    Type,
    ProductFeatureControllerServiceService, ProductFeature, Inventory
} from '../_dal/ipohdrum';
import {ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalfunctionService} from '../_dal/common/services/globalfunction.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.page.html',
    styleUrls: ['./shop.page.scss'],
})

export class ShopPage implements OnInit, OnDestroy {

    // Strings
    constructorName = '[' + this.constructor.name + ']';
    keywordToSearchItems = '';

    // Booleans
    isLoadingCategories = true;
    isLoadingProductFeaturesAndProductInventories = true;

    // Arrays
    listOfCategories: Array<Type> = [];
    listOfProductFeatures: Array<ProductFeature> = [];
    listOfProducts: Array<Inventory> = [];
    imageObject: Array<object> = [
        {
            image: 'assets/images/ekko.jpg',
            thumbImage: 'assets/images/ekko.jpg',
            alt: 'ekko alt of image',
            title: 'Ekko'
        },
        {
            image: 'assets/images/deku.jpeg',
            thumbImage: 'assets/images/deku.jpeg',
            alt: 'deku alt of image',
            title: 'Deku'
        },
        {
            image: 'assets/images/kitty.jpg',
            thumbImage: 'assets/images/kitty.jpg',
            alt: 'kitty alt of image',
            title: 'Kitty'
        }
    ];
    // Objects
    referInfiniteScroll: any;

    // Subscriptions
    inventorySubscription: any;
    typeSubscription: any;
    productFeaturesSubscription: any;

    constructor(
        private inventoryControllerService: InventoryControllerServiceService,
        private ngZone: NgZone,
        private ref: ChangeDetectorRef,
        private navController: NavController,
        private router: Router,
        private route: ActivatedRoute,
        private typeControllerService: TypeControllerServiceService,
        private productFeatureControllerService: ProductFeatureControllerServiceService,
        private globalFunctionService: GlobalfunctionService
    ) {
        console.log(this.constructorName + 'Initializing component');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            // this.getListOfCategories();
            this.getListOfProductFeatures();
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
            if (this.inventorySubscription) {
                this.inventorySubscription.unsubscribe();
            }
            if (this.typeSubscription) {
                this.typeSubscription.unsubscribe();
            }
            if (this.productFeaturesSubscription) {
                this.productFeaturesSubscription.unsubscribe();
            }
        });
    }

    getListOfCategories() {
        this.isLoadingCategories = true;
        if (this.typeSubscription) {
            this.typeSubscription.unsubscribe();
        }
        this.typeSubscription = this.typeControllerService.getTypes().subscribe(resp => {
            if (resp.code === 200) {
                this.listOfCategories = resp.data;
            } else {
                this.showPromptAlertWarning();
            }
            this.isLoadingCategories = false;
        }, error => {
            console.log('API error while retrieving list of Categories');
            this.isLoadingCategories = false;
            this.showPromptAlertWarning();
        });
    }

    getListOfProductFeatures() {
        this.isLoadingProductFeaturesAndProductInventories = true;
        if (this.productFeaturesSubscription) {
            this.productFeaturesSubscription.unsubscribe();
        }
        this.productFeaturesSubscription = this.productFeatureControllerService.getProductFeatures().subscribe(resp => {
            if (resp.code === 200) {
                this.listOfProductFeatures = resp.data;
                this.listOfProductFeatures.forEach((prodFeatureObj) => {
                    this.getListOfInventoriesBasedOnProductFeatures(prodFeatureObj.uid);
                });
            } else {
                this.listOfProductFeatures = null;
                this.showPromptAlertWarning();
            }
        }, error => {
            console.log('API error while retrieving ProductFeature list.');
            this.showPromptAlertWarning();
        });
    }

    getListOfInventoriesBasedOnProductFeatures(prodFeatureUid: string) {
        this.productFeatureControllerService.getFeaturedProductListByUid(
            prodFeatureUid,
            1,
            6
        ).subscribe(resp => {
            // console.log(resp);
            if (resp.code === 200) {
                this.listOfProducts.push(resp.data);
                // console.log(this.listOfProducts);
            } else {
                this.listOfProducts.push(null);
            }
            this.isLoadingProductFeaturesAndProductInventories = false;
        }, error => {
            console.log('API error while retrieving Inventories based on ProductFeature UID');
            this.isLoadingProductFeaturesAndProductInventories = false;
            this.showPromptAlertWarning();
        });
    }

    viewProductDetail(inventoryUID: string) {
        inventoryUID += '&1';
        this.router.navigate(['product-detail', inventoryUID], {relativeTo: this.route}).catch(reason => {
            console.log('Routing navigation failed');
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('ERROR', 'Unable to view Inventory\'s details, please try again later.', 'warning', 'top');
            this.router.navigate(['/home']);
        });
    }

    showPromptAlertWarning() {
        this.globalFunctionService.presentAlertConfirm('Error!',
            'Oops, something went wrong, please try again later!',
            'Cancel', 'Ok',
            undefined, undefined);
    }

    showMore(productFeatureUid: string) {
        this.router.navigate(['show-more-products', productFeatureUid], {relativeTo: this.route}).catch(reason => {
            console.log('Routing navigation failed');
            // tslint:disable-next-line:max-line-length
            this.globalFunctionService.simpleToast('WARNING', 'Unable to retrieve list of Inventories, please try again later.', 'warning', 'top');
            this.router.navigate(['/ipoh-drum/home']);
        });
    }

    ionRefresh(event) {
        if (this.referInfiniteScroll) {
            this.referInfiniteScroll.target.disabled = false;
        }
        this.getListOfProductFeatures();
        setTimeout(() => {
            event.target.complete();
        }, 500);
    }

/*    // TODO
    selectCategory(selectedCategoryUid: string) {
        console.log('selected ' + selectedCategoryUid);
    }*/
}
