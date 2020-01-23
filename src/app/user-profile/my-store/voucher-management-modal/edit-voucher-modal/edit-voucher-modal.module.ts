import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditVoucherModalPage } from './edit-voucher-modal.page';

const routes: Routes = [
  {
    path: 'edit-voucher-modal',
    component: EditVoucherModalPage
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

export class EditVoucherModalPageModule {}
