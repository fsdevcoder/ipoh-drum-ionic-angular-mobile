import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WarrantyManagementModalPage } from './warranty-management-modal.page';

const routes: Routes = [
  {
    path: 'warranty-management-modal',
    component: WarrantyManagementModalPage
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

export class WarrantyManagementModalPageModule {}
