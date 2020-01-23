import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartPage } from './shopping-cart.page';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartPage
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
  declarations: [
      ShoppingCartPage
  ]
})

export class ShoppingCartPageModule {}
