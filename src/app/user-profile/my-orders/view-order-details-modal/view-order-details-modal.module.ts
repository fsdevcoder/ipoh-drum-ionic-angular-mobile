import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewOrderDetailsModalPage } from './view-order-details-modal.page';

const routes: Routes = [
  {
    path: 'view-order-tails-modal',
    component: ViewOrderDetailsModalPage
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

export class ViewOrderDetailsModalPageModule {}
