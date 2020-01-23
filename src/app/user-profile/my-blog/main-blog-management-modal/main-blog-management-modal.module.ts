import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainBlogManagementModalPage } from './main-blog-management-modal.page';

const routes: Routes = [
  {
    path: 'main-blog-management-modal',
    component: MainBlogManagementModalPage
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

export class MainBlogManagementModalPageModule {}
