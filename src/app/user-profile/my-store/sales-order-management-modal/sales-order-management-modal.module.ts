import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SalesOrderManagementModalPage } from './sales-order-management-modal.page';

const routes: Routes = [
  {
    path: 'sales-order-management-modal',
    component: SalesOrderManagementModalPage
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

export class SalesOrderManagementModalPageModule {}
