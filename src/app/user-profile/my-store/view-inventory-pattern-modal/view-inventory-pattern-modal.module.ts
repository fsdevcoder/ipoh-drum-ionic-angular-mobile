import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewInventoryPatternModalPage } from './view-inventory-pattern-modal.page';

const routes: Routes = [
  {
    path: 'view-inventory-pattern-modal',
    component: ViewInventoryPatternModalPage
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

export class ViewInventoryPatternModalPageModule {}
