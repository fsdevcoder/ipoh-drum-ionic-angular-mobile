import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ViewSelectedArticleModalPage } from './view-selected-article-modal.page';

const routes: Routes = [
  {
    path: 'view-selected-article-modal',
    component: ViewSelectedArticleModalPage
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

export class ViewSelectedArticleModalPageModule {}
