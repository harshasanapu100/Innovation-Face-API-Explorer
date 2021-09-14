import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { product, productsCollection } from '../product';
import { CartState } from '../services/cart-state';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  loaded: boolean = true
  products: any[];
  private subscription: Subscription;
  paymentTypes: any[] = [
    {
      id:1, type:'Face Recognization Payment (FRP)'
    },
    {
      id:2, type:'UPI Payment'
    },
    {
      id:1, type:'Credit / Debit Card'
    },
    {
      id:1, type:'NetBanking'
    },
  ];


  constructor(private _cartService: CartService) { }
  ngOnInit() {
    this.subscription = this
      ._cartService
      .CartState
      .subscribe((state: CartState) => {
        this.products = state.products;
      });

  }
  ngOnDestroy() {
    this
      .subscription
      .unsubscribe();
  }

}
