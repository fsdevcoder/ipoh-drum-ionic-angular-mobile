import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewInventoryFamiliesPatternModalPage } from './view-inventory-families-pattern-modal.page';

const routes: Routes = [
  {
    path: 'view-inventory-families-pattern-modal',
    component: ViewInventoryFamiliesPatternModalPage
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

export class ViewInventoryFamiliesPatternModalPageModule {}
