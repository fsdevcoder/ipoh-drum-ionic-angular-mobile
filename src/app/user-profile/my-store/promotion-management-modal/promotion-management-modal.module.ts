import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PromotionManagementModalPage } from './promotion-management-modal.page';

const routes: Routes = [
  {
    path: 'promotion-management-modal',
    component: PromotionManagementModalPage
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

export class PromotionManagementModalPageModule {}
