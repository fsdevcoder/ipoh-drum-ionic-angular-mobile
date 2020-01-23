import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductDetailPage } from './product-detail.page';
import {ProductVariationModalPageModule} from './product-variation-modal/product-variation-modal.module';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductVariationModalPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: []
})

export class ProductDetailPageModule {}
