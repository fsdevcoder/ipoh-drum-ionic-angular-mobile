import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ShippingManagementModalPage } from './shipping-management-modal.page';

const routes: Routes = [
  {
    path: 'shipping-management-modal',
    component: ShippingManagementModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})

export class ShippingManagementModalPageModule {}
