import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditWarrantyModalPage } from './edit-warranty-modal.page';

const routes: Routes = [
  {
    path: 'edit-warranty-modal',
    component: EditWarrantyModalPage
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

export class EditWarrantyModalPageModule {}
