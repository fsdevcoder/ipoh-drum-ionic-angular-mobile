import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyStatisticsPage } from './my-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: MyStatisticsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyStatisticsPage]
})
export class MyStatisticsPageModule {}
