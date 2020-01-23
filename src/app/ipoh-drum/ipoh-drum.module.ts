import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {IpohDrumPage} from './ipoh-drum.page';
import {ErrorPageComponent} from '../shared/error-page/error-page.component';
import {LoginRegisterComponent} from '../login-register/login-register.component';
import {ShowHidePasswordModule} from 'ngx-show-hide-password';
import {CheckAuthenticatedService} from '../_dal/common/services/check-authenticated.service';
import {ProductVariationModalPageModule} from '../shop/product-detail/product-variation-modal/product-variation-modal.module';
import {AddInventoryPageModule} from '../user-profile/my-store/add-inventory/add-inventory.module';
import {ProductVariationModalPage} from '../shop/product-detail/product-variation-modal/product-variation-modal.page';
import {AddInventoryPage} from '../user-profile/my-store/add-inventory/add-inventory.page';
import {SharedModule} from '../shared/shared.module';
import {FormWizardModule} from 'angular-wizard-form/dist';
// tslint:disable-next-line:max-line-length
import {InvFamilyPatternModalPageModule} from '../user-profile/my-store/add-inventory/inv-family-pattern-modal/inv-family-pattern-modal.module';
import {InvFamilyPatternModalPage} from '../user-profile/my-store/add-inventory/inv-family-pattern-modal/inv-family-pattern-modal.page';
// tslint:disable-next-line:max-line-length
import {AddInventoryPatternModalPageModule} from '../user-profile/my-store/add-inventory/inv-family-pattern-modal/add-inventory-pattern-modal/add-inventory-pattern-modal.module';
// tslint:disable-next-line:max-line-length
import {AddInventoryPatternModalPage} from '../user-profile/my-store/add-inventory/inv-family-pattern-modal/add-inventory-pattern-modal/add-inventory-pattern-modal.page';
// tslint:disable-next-line:max-line-length
import {StoreInventoryManagementModalPageModule} from '../user-profile/my-store/store-inventory-management-modal/store-inventory-management-modal.module';
// tslint:disable-next-line:max-line-length
import {StoreInventoryManagementModalPage} from '../user-profile/my-store/store-inventory-management-modal/store-inventory-management-modal.page';
import {InventoryManagementModalPageModule} from '../user-profile/my-store/inventory-management-modal/inventory-management-modal.module';
import {InventoryManagementModalPage} from '../user-profile/my-store/inventory-management-modal/inventory-management-modal.page';
import {InventoryDetailsModalPageModule} from '../user-profile/my-store/inventory-details-modal/inventory-details-modal.module';
import {InventoryDetailsModalPage} from '../user-profile/my-store/inventory-details-modal/inventory-details-modal.page';
import {AddStoreModalPage} from '../user-profile/my-store/add-store-modal/add-store-modal.page';
import {AddStoreModalPageModule} from '../user-profile/my-store/add-store-modal/add-store-modal.module';
import { IonicSelectableModule } from 'ionic-selectable';
import {EditStoreModalPageModule} from '../user-profile/my-store/edit-store-modal/edit-store-modal.module';
import {EditStoreModalPage} from '../user-profile/my-store/edit-store-modal/edit-store-modal.page';
import {PromotionManagementModalPageModule} from '../user-profile/my-store/promotion-management-modal/promotion-management-modal.module';
import {PromotionManagementModalPage} from '../user-profile/my-store/promotion-management-modal/promotion-management-modal.page';
// tslint:disable-next-line:max-line-length
import {AddPromotionModalPageModule} from '../user-profile/my-store/promotion-management-modal/add-promotion-modal/add-promotion-modal.module';
import {AddPromotionModalPage} from '../user-profile/my-store/promotion-management-modal/add-promotion-modal/add-promotion-modal.page';
import {WarrantyManagementModalPageModule} from '../user-profile/my-store/warranty-management-modal/warranty-management-modal.module';
import {WarrantyManagementModalPage} from '../user-profile/my-store/warranty-management-modal/warranty-management-modal.page';
import {AddWarrantyModalPageModule} from '../user-profile/my-store/warranty-management-modal/add-warranty-modal/add-warranty-modal.module';
import {AddWarrantyModalPage} from '../user-profile/my-store/warranty-management-modal/add-warranty-modal/add-warranty-modal.page';
import {ShippingManagementModalPageModule} from '../user-profile/my-store/shipping-management-modal/shipping-management-modal.module';
import {ShippingManagementModalPage} from '../user-profile/my-store/shipping-management-modal/shipping-management-modal.page';
import {AddShippingModalPageModule} from '../user-profile/my-store/shipping-management-modal/add-shipping-modal/add-shipping-modal.module';
import {AddShippingModalPage} from '../user-profile/my-store/shipping-management-modal/add-shipping-modal/add-shipping-modal.page';
// tslint:disable-next-line:max-line-length
import {EditPromotionModalPageModule} from '../user-profile/my-store/promotion-management-modal/edit-promotion-modal/edit-promotion-modal.module';
import {EditPromotionModalPage} from '../user-profile/my-store/promotion-management-modal/edit-promotion-modal/edit-promotion-modal.page';
import {EditWarrantyModalPage} from '../user-profile/my-store/warranty-management-modal/edit-warranty-modal/edit-warranty-modal.page';
// tslint:disable-next-line:max-line-length
import {EditWarrantyModalPageModule} from '../user-profile/my-store/warranty-management-modal/edit-warranty-modal/edit-warranty-modal.module';
// tslint:disable-next-line:max-line-length
import {EditShippingModalPageModule} from '../user-profile/my-store/shipping-management-modal/edit-shipping-modal/edit-shipping-modal.module';
import {EditShippingModalPage} from '../user-profile/my-store/shipping-management-modal/edit-shipping-modal/edit-shipping-modal.page';
import {CheckUnauthenticatedService} from '../_dal/common/services/check-unauthenticated.service';
import {VoucherManagementModalPageModule} from '../user-profile/my-store/voucher-management-modal/voucher-management-modal.module';
import {VoucherManagementModalPage} from '../user-profile/my-store/voucher-management-modal/voucher-management-modal.page';
import {AddVoucherModalPageModule} from '../user-profile/my-store/voucher-management-modal/add-voucher-modal/add-voucher-modal.module';
import {AddVoucherModalPage} from '../user-profile/my-store/voucher-management-modal/add-voucher-modal/add-voucher-modal.page';
import {EditVoucherModalPage} from '../user-profile/my-store/voucher-management-modal/edit-voucher-modal/edit-voucher-modal.page';
import {EditVoucherModalPageModule} from '../user-profile/my-store/voucher-management-modal/edit-voucher-modal/edit-voucher-modal.module';
import {ViewStoreModalPageModule} from '../user-profile/my-store/view-store-modal/view-store-modal.module';
import {ViewStoreModalPage} from '../user-profile/my-store/view-store-modal/view-store-modal.page';
import {ViewInventoryModalPage} from '../user-profile/my-store/view-inventory-modal/view-inventory-modal.page';
import {ViewInventoryModalPageModule} from '../user-profile/my-store/view-inventory-modal/view-inventory-modal.module';
// tslint:disable-next-line:max-line-length
import {EditInventoryFamiliesAndPatternsPageModule} from '../user-profile/my-store/edit-inventory-families-and-patterns/edit-inventory-families-and-patterns.module';
// tslint:disable-next-line:max-line-length
import {EditInventoryFamiliesAndPatternsPage} from '../user-profile/my-store/edit-inventory-families-and-patterns/edit-inventory-families-and-patterns.page';
import {VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {PlaySelectedVideoModalPageModule} from '../home/sale-videos/play-selected-video-modal/play-selected-video-modal.module';
import {PlaySelectedVideoModalPage} from '../home/sale-videos/play-selected-video-modal/play-selected-video-modal.page';
import {RatingModule} from 'ng-starrating';
import {ViewSelectedArticleModalPageModule} from '../home/sale-articles/view-selected-article-modal/view-selected-article-modal.module';
import {ViewSelectedArticleModalPage} from '../home/sale-articles/view-selected-article-modal/view-selected-article-modal.page';
import {PaymentInfoModalPageModule} from '../shared/payment-info-modal/payment-info-modal.module';
import {PaymentInfoModalPage} from '../shared/payment-info-modal/payment-info-modal.page';
import {AddBlogModalPageModule} from '../user-profile/my-blog/add-blog-modal/add-blog-modal.module';
import {AddBlogModalPage} from '../user-profile/my-blog/add-blog-modal/add-blog-modal.page';
import {ViewBlogModalPage} from '../user-profile/my-blog/view-blog-modal/view-blog-modal.page';
import {ViewBlogModalPageModule} from '../user-profile/my-blog/view-blog-modal/view-blog-modal.module';
import {EditBlogModalPageModule} from '../user-profile/my-blog/edit-blog-modal/edit-blog-modal.module';
import {EditBlogModalPage} from '../user-profile/my-blog/edit-blog-modal/edit-blog-modal.page';
import {MainBlogManagementModalPage} from '../user-profile/my-blog/main-blog-management-modal/main-blog-management-modal.page';
import {MainBlogManagementModalPageModule} from '../user-profile/my-blog/main-blog-management-modal/main-blog-management-modal.module';
import {ArticleManagementModalPageModule} from '../user-profile/my-blog/article-management-modal/article-management-modal.module';
import {ArticleManagementModalPage} from '../user-profile/my-blog/article-management-modal/article-management-modal.page';
import {CreateArticleModalPage} from '../user-profile/my-blog/article-management-modal/create-article-modal/create-article-modal.page';
// tslint:disable-next-line:max-line-length
import {CreateArticleModalPageModule} from '../user-profile/my-blog/article-management-modal/create-article-modal/create-article-modal.module';
import {ViewArticleModalPage} from '../user-profile/my-blog/article-management-modal/view-article-modal/view-article-modal.page';
import {ViewArticleModalPageModule} from '../user-profile/my-blog/article-management-modal/view-article-modal/view-article-modal.module';
import {EditArticleModalPageModule} from '../user-profile/my-blog/article-management-modal/edit-article-modal/edit-article-modal.module';
import {EditArticleModalPage} from '../user-profile/my-blog/article-management-modal/edit-article-modal/edit-article-modal.page';
import {AddChannelModalPage} from '../user-profile/my-channel/add-channel-modal/add-channel-modal.page';
import {AddChannelModalPageModule} from '../user-profile/my-channel/add-channel-modal/add-channel-modal.module';
// tslint:disable-next-line:max-line-length
import {MainChannelManagementModalPageModule} from '../user-profile/my-channel/main-channel-management-modal/main-channel-management-modal.module';
import {MainChannelManagementModalPage} from '../user-profile/my-channel/main-channel-management-modal/main-channel-management-modal.page';
import {ViewChannelModalPage} from '../user-profile/my-channel/view-channel-modal/view-channel-modal.page';
import {ViewChannelModalPageModule} from '../user-profile/my-channel/view-channel-modal/view-channel-modal.module';
import {VideoManagementModalPage} from '../user-profile/my-channel/video-management-modal/video-management-modal.page';
import {VideoManagementModalPageModule} from '../user-profile/my-channel/video-management-modal/video-management-modal.module';
import {EditChannelModalPage} from '../user-profile/my-channel/edit-channel-modal/edit-channel-modal.page';
import {EditChannelModalPageModule} from '../user-profile/my-channel/edit-channel-modal/edit-channel-modal.module';
import {ViewVideoModalPageModule} from '../user-profile/my-channel/video-management-modal/view-video-modal/view-video-modal.module';
import {ViewVideoModalPage} from '../user-profile/my-channel/video-management-modal/view-video-modal/view-video-modal.page';
import {CreateVideoModalPage} from '../user-profile/my-channel/video-management-modal/create-video-modal/create-video-modal.page';
import {CreateVideoModalPageModule} from '../user-profile/my-channel/video-management-modal/create-video-modal/create-video-modal.module';
import {EditVideoModalPageModule} from '../user-profile/my-channel/video-management-modal/edit-video-modal/edit-video-modal.module';
import {EditVideoModalPage} from '../user-profile/my-channel/video-management-modal/edit-video-modal/edit-video-modal.page';
// tslint:disable-next-line:max-line-length
import {ViewInventoryFamiliesPatternModalPageModule} from '../user-profile/my-store/view-inventory-families-pattern-modal/view-inventory-families-pattern-modal.module';
// tslint:disable-next-line:max-line-length
import {ViewInventoryFamiliesPatternModalPage} from '../user-profile/my-store/view-inventory-families-pattern-modal/view-inventory-families-pattern-modal.page';
import {ViewInventoryPatternModalPage} from '../user-profile/my-store/view-inventory-pattern-modal/view-inventory-pattern-modal.page';
// tslint:disable-next-line:max-line-length
import {ViewInventoryPatternModalPageModule} from '../user-profile/my-store/view-inventory-pattern-modal/view-inventory-pattern-modal.module';
import {EditInventoryPatternsPageModule} from '../user-profile/my-store/edit-inventory-patterns/edit-inventory-patterns.module';
import {EditInventoryPatternsPage} from '../user-profile/my-store/edit-inventory-patterns/edit-inventory-patterns.page';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {ViewOrderDetailsModalPage} from '../user-profile/my-orders/view-order-details-modal/view-order-details-modal.page';
import {ViewOrderDetailsModalPageModule} from '../user-profile/my-orders/view-order-details-modal/view-order-details-modal.module';
import {SalesOrderManagementModalPage} from '../user-profile/my-store/sales-order-management-modal/sales-order-management-modal.page';
import {SalesOrderManagementModalPageModule} from '../user-profile/my-store/sales-order-management-modal/sales-order-management-modal.module';
import {ViewSalesOrderModalPageModule} from '../user-profile/my-store/view-sales-order-modal/view-sales-order-modal.module';
import {ViewSalesOrderModalPage} from '../user-profile/my-store/view-sales-order-modal/view-sales-order-modal.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/ipoh-drum/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginRegisterComponent,
        canActivate: [CheckUnauthenticatedService]
    },
    {
        path: 'ipoh-drum',
        component: IpohDrumPage,
        children: [
            {path: '', pathMatch: 'full', redirectTo: '/ipoh-drum/home'},
            {path: 'home', loadChildren: '../home/home.module#HomePageModule'},
            {path: 'shop', loadChildren: '../shop/shop.module#ShopPageModule'},
            {path: 'shopping-cart', loadChildren: '../shopping-cart/shopping-cart.module#ShoppingCartPageModule'},
            {path: 'user-profile',
                loadChildren: '../user-profile/user-profile.module#UserProfilePageModule',
                canActivate: [CheckAuthenticatedService]
            }
        ]
    },
    {path: '**', redirectTo: 'error-page', pathMatch: 'full'},
    {path: 'error-page', component: ErrorPageComponent}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SharedModule,
        ShowHidePasswordModule,
        FormWizardModule,
        IonicSelectableModule,
        RouterModule.forChild(routes),
        DeviceDetectorModule.forRoot(),
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        ProductVariationModalPageModule,
        AddInventoryPageModule,
        InvFamilyPatternModalPageModule,
        AddInventoryPatternModalPageModule,
        StoreInventoryManagementModalPageModule,
        InventoryManagementModalPageModule,
        InventoryDetailsModalPageModule,
        AddStoreModalPageModule,
        EditStoreModalPageModule,
        PromotionManagementModalPageModule,
        AddPromotionModalPageModule,
        EditPromotionModalPageModule,
        WarrantyManagementModalPageModule,
        AddWarrantyModalPageModule,
        EditWarrantyModalPageModule,
        ShippingManagementModalPageModule,
        AddShippingModalPageModule,
        EditShippingModalPageModule,
        VoucherManagementModalPageModule,
        AddVoucherModalPageModule,
        EditVoucherModalPageModule,
        ViewStoreModalPageModule,
        ViewInventoryModalPageModule,
        EditInventoryFamiliesAndPatternsPageModule,
        PlaySelectedVideoModalPageModule,
        RatingModule,
        ViewSelectedArticleModalPageModule,
        PaymentInfoModalPageModule,
        AddBlogModalPageModule,
        ViewBlogModalPageModule,
        EditBlogModalPageModule,
        MainBlogManagementModalPageModule,
        ArticleManagementModalPageModule,
        CreateArticleModalPageModule,
        ViewArticleModalPageModule,
        EditArticleModalPageModule,
        AddChannelModalPageModule,
        MainChannelManagementModalPageModule,
        ViewChannelModalPageModule,
        VideoManagementModalPageModule,
        EditChannelModalPageModule,
        ViewVideoModalPageModule,
        CreateVideoModalPageModule,
        EditVideoModalPageModule,
        ViewInventoryFamiliesPatternModalPageModule,
        ViewInventoryPatternModalPageModule,
        EditInventoryPatternsPageModule,
        ViewOrderDetailsModalPageModule,
        SalesOrderManagementModalPageModule,
        ViewSalesOrderModalPageModule
    ],
    declarations: [
        IpohDrumPage,
        ErrorPageComponent,
        LoginRegisterComponent,
        ProductVariationModalPage,
        AddInventoryPage,
        InvFamilyPatternModalPage,
        AddInventoryPatternModalPage,
        StoreInventoryManagementModalPage,
        InventoryManagementModalPage,
        InventoryDetailsModalPage,
        AddStoreModalPage,
        EditStoreModalPage,
        PromotionManagementModalPage,
        AddPromotionModalPage,
        EditPromotionModalPage,
        WarrantyManagementModalPage,
        AddWarrantyModalPage,
        EditWarrantyModalPage,
        ShippingManagementModalPage,
        AddShippingModalPage,
        EditShippingModalPage,
        VoucherManagementModalPage,
        AddVoucherModalPage,
        EditVoucherModalPage,
        ViewStoreModalPage,
        ViewInventoryModalPage,
        EditInventoryFamiliesAndPatternsPage,
        PlaySelectedVideoModalPage,
        ViewSelectedArticleModalPage,
        PaymentInfoModalPage,
        AddBlogModalPage,
        ViewBlogModalPage,
        EditBlogModalPage,
        MainBlogManagementModalPage,
        ArticleManagementModalPage,
        CreateArticleModalPage,
        ViewArticleModalPage,
        EditArticleModalPage,
        AddChannelModalPage,
        MainChannelManagementModalPage,
        ViewChannelModalPage,
        VideoManagementModalPage,
        EditChannelModalPage,
        ViewVideoModalPage,
        CreateVideoModalPage,
        EditVideoModalPage,
        ViewInventoryFamiliesPatternModalPage,
        ViewInventoryPatternModalPage,
        EditInventoryPatternsPage,
        ViewOrderDetailsModalPage,
        SalesOrderManagementModalPage,
        ViewSalesOrderModalPage
    ]
})

export class IpohDrumPageModule {
}
