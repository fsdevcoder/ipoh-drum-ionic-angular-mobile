import {Component, NgZone, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {commonConfig} from '../../../../../_dal/common/commonConfig';

@Component({
  selector: 'app-add-inventory-pattern-modal',
  templateUrl: './add-inventory-pattern-modal.page.html',
  styleUrls: ['./add-inventory-pattern-modal.page.scss'],
})

export class AddInventoryPatternModalPage implements OnInit {

  // Strings
  constructorName = '[' + this.constructor.name + ']';

  // Regex
  priceRegex = new RegExp(/^\d+(\.\d{2})?$/);
  numericOnlyRegex = commonConfig.numericOnlyRegex;

  // NgModels
  inventoryPatternNameModel: string;
  inventoryPatternDescriptionModel: string;
  inventoryPatternCostModel: number;
  inventoryPatternSellingPriceModel: number;
  inventoryPatternStockQuantityModel: number;
  selectedPatternOnSaleToggle = true;

  // Numbers
  inventoryPatternNameMaxLength = commonConfig.inventoryPatternNameMaxLength;
  inventoryPatternDescMinLength = commonConfig.inventoryPatternDescMinLength;
  inventoryPatternDescMaxLength = commonConfig.inventoryPatternDescMaxLength;
  inventoryPatternCostMaxLength = commonConfig.inventoryPatternCostMaxLength;
  inventoryPatternSellingPriceMaxLength = commonConfig.inventoryPatternSellingPriceMaxLength;
  inventoryPatternStockQuantityMaxLength = commonConfig.inventoryPatternStockQuantityMaxLength;

  // FormGroups
  inventoryPatternFormGroup: FormGroup;

  constructor(
      private ngZone: NgZone,
      private modalController: ModalController
  ) {
    console.log(this.constructorName + 'Initializing component');
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.inventoryPatternFormGroup = new FormGroup({
        inventoryPatternName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryPatternNameMaxLength)
        ]),
        inventoryPatternDescription: new FormControl(null, [
          Validators.required,
          Validators.minLength(this.inventoryPatternDescMinLength),
          Validators.maxLength(this.inventoryPatternDescMaxLength)
        ]),
        inventoryPatternCost: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryPatternCostMaxLength),
          Validators.pattern(this.priceRegex)
        ]),
        inventoryPatternSellingPrice: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryPatternSellingPriceMaxLength),
          Validators.pattern(this.priceRegex)
        ]),
        inventoryPatternStockQuantity: new FormControl(null, [
          Validators.required,
          Validators.maxLength(this.inventoryPatternStockQuantityMaxLength),
          Validators.pattern(this.numericOnlyRegex)
        ])
      });
    });
  }

  togglePatternOnSaleCheckbox() {
    this.selectedPatternOnSaleToggle = !this.selectedPatternOnSaleToggle;
  }

  addPattern() {
    const inventoryPatternToInsert = {
      id: null,
      inventory_id: null,
      uid: null,
      cost: this.inventoryPatternCostModel,
      // created_at
      desc: this.inventoryPatternDescriptionModel,
      // id
      // imgpath
      // imgpublicid
      // inventory_family_id
      name: this.inventoryPatternNameModel,
      onsale: this.selectedPatternOnSaleToggle,
      price: this.inventoryPatternSellingPriceModel,
      qty: this.inventoryPatternStockQuantityModel
      // salesqty
      // status
      // uid
      // updated_at
    };

    // TODO Hardcoded-Data
    // const inventoryPatternToInsert = {
    //   cost: '59.60',
    //   // created_at
    //   desc: 'pattern desccccf sdfsdfs dfsdfsdfwerwerwer',
    //   // id
    //   // imgpath
    //   // imgpublicid
    //   // inventory_family_id
    //   name: 'pattern name',
    //   onsale: false,
    //   price: '60',
    //   qty: '99'
    //   // salesqty
    //   // status
    //   // uid
    //   // updated_at
    // };
    console.log(inventoryPatternToInsert);
    this.modalController.dismiss(inventoryPatternToInsert);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
