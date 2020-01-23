import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddInventoryPatternModalPage } from './add-inventory-pattern-modal.page';

const routes: Routes = [
  {
    path: 'add-inventory-pattern-modal',
    component: AddInventoryPatternModalPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  declarations: []
})

export class AddInventoryPatternModalPageModule {}
