import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
   cartItems: CartItem[] = [];
   totalPrice: Subject<number> = new Subject<number>();
   totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }

  addToCart(theCartItem: CartItem){
      let alreadyExistsInCart: boolean =false;
      let existingCartItem: CartItem =undefined;

      if(this.cartItems.length>0){

//        for(let tempCartItem of this.cartItems){

  //        if(tempCartItem.id === theCartItem.id){
    //      existingCartItem=tempCartItem;
      //    break;
        //} 
      //}
       existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
        alreadyExistsInCart = (existingCartItem != undefined);
      }
      if(alreadyExistsInCart){
        existingCartItem.quantity++;
      }
      else{
        this.cartItems.push(theCartItem);
      }

      this.computeCartTotals();

  }
  computeCartTotals() {
   let totalPriceValues: number =0;
   let totalQuantityValues: number =0;
   for(let currentCartItem of this.cartItems){
       totalPriceValues += currentCartItem.quantity * currentCartItem.unitPrice;
       totalQuantityValues += currentCartItem.quantity; 
   }

   this.totalPrice.next(totalPriceValues);
   this.totalQuantity.next(totalQuantityValues);

   this.logCartData(totalPriceValues,totalQuantityValues);

  }
  logCartData(totalPriceValues: number, totalQuantityValues: number) {
    console.log('Contents 0f cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity},unitprice=${tempCartItem.unitPrice}`);

    }
      console.log(`totalPrice: ${totalPriceValues.toFixed(2)}, totalQuantity: ${totalQuantityValues}`);

  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity == 0){

      this.remove(theCartItem);

    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if(itemIndex > -1){

      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

}
