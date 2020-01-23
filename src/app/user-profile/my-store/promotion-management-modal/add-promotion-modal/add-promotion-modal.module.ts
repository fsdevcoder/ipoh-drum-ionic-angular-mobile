import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddPromotionModalPage } from './add-promotion-modal.page';

const routes: Routes = [
  {
    path: 'add-promotion-modal',
    component: AddPromotionModalPage
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

export class AddPromotionModalPageModule {}
