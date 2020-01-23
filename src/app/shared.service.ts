import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {GlobalfunctionService} from './_dal/common/services/globalfunction.service';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructorName = '[' + this.constructor.name + ']';

  private selectedInventoryToCart: Array<any> = [];
  private emitSelectedInventoryToCartSubject = new Subject<any>();
  emitSelectedInventoryToCart$: Observable<any> = this.emitSelectedInventoryToCartSubject.asObservable();

  private numberOfSelectedInventoriesInCart = 0;
  private emitNumberOfSelectedInventoriesInCartSubject = new Subject<number>();
  emitNumberOfSelectedInventoriesInCart$: Observable<number> = this.emitNumberOfSelectedInventoriesInCartSubject.asObservable();

  constructor(
      private globalFunctionService: GlobalfunctionService
  ) {
    console.log(this.constructorName + 'Initializing component');
    this.emitSelectedInventoryToCart$ = this.emitSelectedInventoryToCartSubject.asObservable();
    this.emitNumberOfSelectedInventoriesInCart$ = this.emitNumberOfSelectedInventoriesInCartSubject.asObservable();
  }

  emitSelectedInventory(selectedInventory) {
    let alreadyContainInventory = false;
    selectedInventory.selectedQuantity = 0;
    let totalQuantitiesOfThisItemInCart = 0;
    for (let h = 0 ; h < this.selectedInventoryToCart.length ; h++) {
      if (selectedInventory.uid === this.selectedInventoryToCart[h].uid) {
        totalQuantitiesOfThisItemInCart += this.selectedInventoryToCart[h].selectedQuantity;
      }
    }
    if (this.selectedInventoryToCart.length > 0) {
      for (let i = 0 ; i < this.selectedInventoryToCart.length ; i++) {
        if (this.selectedInventoryToCart[i].uid === selectedInventory.uid
            && this.selectedInventoryToCart[i].selectedInventoryFamily.id === selectedInventory.selectedInventoryFamily.id
            && this.selectedInventoryToCart[i].selectedInventoryPattern.id === selectedInventory.selectedInventoryPattern.id
        ) {
          alreadyContainInventory = true;
          if (this.selectedInventoryToCart[i].qty >= (totalQuantitiesOfThisItemInCart + selectedInventory.quantitiesToAdd)) {
            this.selectedInventoryToCart[i].selectedQuantity += selectedInventory.quantitiesToAdd;
            this.globalFunctionService.simpleToast(null, 'Item has been added to your cart!', 'success');
          } else {
            this.globalFunctionService.simpleToast(null, 'Not enough stock, please try again with a different quantity number!', 'warning');
          }
          break;
        }
      }
      if (!alreadyContainInventory) {
        if (selectedInventory.qty >= (totalQuantitiesOfThisItemInCart + selectedInventory.quantitiesToAdd)) {
          selectedInventory.selectedQuantity += selectedInventory.quantitiesToAdd;
          this.selectedInventoryToCart.push(selectedInventory);
          this.globalFunctionService.simpleToast(null, 'Item has been added to your cart!', 'success', 'top');
        } else {
          this.globalFunctionService.simpleToast(null, 'Not enough stock, please try again with a different quantity number!', 'warning');
        }
      }
    } else {
      selectedInventory.selectedQuantity += selectedInventory.quantitiesToAdd;
      this.selectedInventoryToCart.push(selectedInventory);
      this.globalFunctionService.simpleToast(null, 'Item has been added to your cart!', 'success');
    }
    this.emitSelectedInventoryToCartSubject.next(this.selectedInventoryToCart);
    this.emitNumberOfSelectedInventoriesInCart();
  }

  emitNumberOfSelectedInventoriesInCart() {
    this.numberOfSelectedInventoriesInCart = this.selectedInventoryToCart.length;
    this.emitNumberOfSelectedInventoriesInCartSubject.next(this.numberOfSelectedInventoriesInCart);
  }

  returnSelectedInventoriesInCart() {
    return this.selectedInventoryToCart;
  }

  clearShoppingCart() {
    this.globalFunctionService.simpleToast(null,  'Cart has been cleared!', 'primary', 'top');
    this.selectedInventoryToCart = [];
    this.emitSelectedInventoryToCartSubject.next(this.selectedInventoryToCart);
    this.emitNumberOfSelectedInventoriesInCart();
  }

  clearShoppingCartWithoutToast() {
    this.selectedInventoryToCart = [];
    this.emitSelectedInventoryToCartSubject.next(this.selectedInventoryToCart);
    this.emitNumberOfSelectedInventoriesInCart();
  }

  removeSpecificInventoryFromCart(inventory: any, indexInCart: number) {
    // Filter the array by 'uid', can be used in the future
    // this.selectedInventoryToCart = this.selectedInventoryToCart.filter(inventoryInCart => inventoryInCart.uid !== inventory.uid);
    this.selectedInventoryToCart.splice(indexInCart, 1);
    this.emitSelectedInventoryToCartSubject.next(this.selectedInventoryToCart);
    this.emitNumberOfSelectedInventoriesInCart();
  }
}
