import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddVoucherModalPage } from './add-voucher-modal.page';

const routes: Routes = [
  {
    path: 'add-voucher-modal',
    component: AddVoucherModalPage
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

export class AddVoucherModalPageModule {}
