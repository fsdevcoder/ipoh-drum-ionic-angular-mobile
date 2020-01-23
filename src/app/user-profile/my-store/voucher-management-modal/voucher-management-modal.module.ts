import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VoucherManagementModalPage } from './voucher-management-modal.page';

const routes: Routes = [
  {
    path: 'voucher-management-modal',
    component: VoucherManagementModalPage
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

export class VoucherManagementModalPageModule {}
