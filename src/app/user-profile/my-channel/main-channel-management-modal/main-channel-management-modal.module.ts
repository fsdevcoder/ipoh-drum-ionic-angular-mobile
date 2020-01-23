import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainChannelManagementModalPage } from './main-channel-management-modal.page';

const routes: Routes = [
  {
    path: 'main-channel-management-modal',
    component: MainChannelManagementModalPage
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

export class MainChannelManagementModalPageModule {}
