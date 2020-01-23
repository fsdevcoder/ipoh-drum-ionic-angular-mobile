import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditShippingModalPage } from './edit-shipping-modal.page';

const routes: Routes = [
  {
    path: 'edit-shipping-modal',
    component: EditShippingModalPage
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

export class EditShippingModalPageModule {}
