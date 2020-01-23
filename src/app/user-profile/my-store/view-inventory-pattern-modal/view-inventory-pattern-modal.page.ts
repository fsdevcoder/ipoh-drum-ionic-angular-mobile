import { Component, OnInit } from '@angular/core';
import {Pattern} from '../../../_dal/ipohdrum';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-view-inventory-pattern-modal',
  templateUrl: './view-inventory-pattern-modal.page.html',
  styleUrls: ['./view-inventory-pattern-modal.page.scss'],
})

export class ViewInventoryPatternModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';

  // Objects
  inventoryPatterns: Pattern;

  constructor(
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    console.log('patterns to show');
    console.log(this.inventoryPatterns);
  }

  closeViewInventoryPatternModal() {
    this.modalController.dismiss();
  }
}
