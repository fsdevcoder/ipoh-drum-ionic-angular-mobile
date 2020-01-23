import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PlaySelectedVideoModalPage } from './play-selected-video-modal.page';

const routes: Routes = [
  {
    path: 'play-selected-video-modal',
    component: PlaySelectedVideoModalPage
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

export class PlaySelectedVideoModalPageModule {}
