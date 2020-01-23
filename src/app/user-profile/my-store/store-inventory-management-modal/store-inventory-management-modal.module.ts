import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StoreInventoryManagementModalPage } from './store-inventory-management-modal.page';

const routes: Routes = [
  {
    path: 'store-inventory-management-modal',
    component: StoreInventoryManagementModalPage
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

export class StoreInventoryManagementModalPageModule {}
