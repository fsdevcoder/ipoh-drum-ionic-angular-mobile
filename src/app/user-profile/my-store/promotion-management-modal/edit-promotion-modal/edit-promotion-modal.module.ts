import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditPromotionModalPage } from './edit-promotion-modal.page';

const routes: Routes = [
  {
    path: 'edit-promotion-modal',
    component: EditPromotionModalPage
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

export class EditPromotionModalPageModule {}
