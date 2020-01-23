import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InventoryDetailsModalPage } from './inventory-details-modal.page';

const routes: Routes = [
  {
    path: 'inventory-details-modal',
    component: InventoryDetailsModalPage
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

export class InventoryDetailsModalPageModule {}
