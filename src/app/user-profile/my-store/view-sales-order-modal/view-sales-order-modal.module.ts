import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewSalesOrderModalPage } from './view-sales-order-modal.page';

const routes: Routes = [
  {
    path: 'view-sales-order-modal',
    component: ViewSalesOrderModalPage
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

export class ViewSalesOrderModalPageModule {}
