import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyOrdersPage } from './my-orders.page';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyOrdersPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
  declarations: [MyOrdersPage]
})

export class MyOrdersPageModule {}
