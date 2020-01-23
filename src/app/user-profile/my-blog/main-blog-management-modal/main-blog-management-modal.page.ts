import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ViewBlogModalPage} from '../view-blog-modal/view-blog-modal.page';
import {ArticleManagementModalPage} from '../article-management-modal/article-management-modal.page';

@Component({
  selector: 'app-main-blog-management-modal',
  templateUrl: './main-blog-management-modal.page.html',
  styleUrls: ['./main-blog-management-modal.page.scss'],
})

export class MainBlogManagementModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';
  selectedBloggerUid: string;

  // Numbers
  selectedBloggerId: number;

  constructor(
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
  }

  async openViewSelectedBlogModal() {
    const modal = await this.modalController.create({
      component: ViewBlogModalPage,
      componentProps: {
        selectedBloggerUid: this.selectedBloggerUid
      }
    });
    return await modal.present();
  }

  async openArticleManagementModal() {
    const modal = await this.modalController.create({
      component: ArticleManagementModalPage,
      componentProps: {
        selectedBloggerUid: this.selectedBloggerUid,
        selectedBloggerId: this.selectedBloggerId
      }
    });
    return await modal.present();
  }
}
