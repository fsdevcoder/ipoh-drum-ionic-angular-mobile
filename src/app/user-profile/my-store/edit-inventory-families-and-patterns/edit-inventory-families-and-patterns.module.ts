import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditInventoryFamiliesAndPatternsPage } from './edit-inventory-families-and-patterns.page';

const routes: Routes = [
  {
    path: 'edit-inventory-families-and-patterns',
    component: EditInventoryFamiliesAndPatternsPage
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

export class EditInventoryFamiliesAndPatternsPageModule {}
