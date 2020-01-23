import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InvFamilyPatternModalPage } from './inv-family-pattern-modal.page';
import {SharedModule} from '../../../../shared/shared.module';

const routes: Routes = [
  {
    path: 'inv-family-pattern-modal',
    component: InvFamilyPatternModalPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule
    ],
  declarations: []
})

export class InvFamilyPatternModalPageModule {}
