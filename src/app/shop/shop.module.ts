import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {ShopPage} from './shop.page';
import {NgImageSliderModule} from 'ng-image-slider';
import {ProductDetailPage} from './product-detail/product-detail.page';
import {RatingModule} from 'ng-starrating';
import {SharedModule} from '../shared/shared.module';
import {ShowMoreProductsPage} from './show-more-products/show-more-products.page';

const routes: Routes = [
    {
        path: '',
        component: ShopPage
    },
    {
        path: 'product-detail/:uid',
        component: ProductDetailPage
    },
    {
        path: 'show-more-products/:uid',
        component: ShowMoreProductsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NgImageSliderModule,
        RouterModule.forChild(routes),
        RatingModule,
        SharedModule
    ],
    declarations: [
        ShopPage,
        ProductDetailPage,
        ShowMoreProductsPage
    ]
})

export class ShopPageModule {
}
