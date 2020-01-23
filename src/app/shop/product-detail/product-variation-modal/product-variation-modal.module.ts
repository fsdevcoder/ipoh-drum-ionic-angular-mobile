import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductVariationModalPage } from './product-variation-modal.page';
import {SharedModule} from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: 'product-variation-modal',
    component: ProductVariationModalPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
  declarations: []
})
export class ProductVariationModalPageModule {}
