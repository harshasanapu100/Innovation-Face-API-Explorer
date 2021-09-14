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
  totalAmount = 0;
  isPaymentShow: boolean = false;
  paymentTypes: any[] = [
    {
      id: 1, type: 'Face Recognization Payment (FRP)'
    },
    {
      id: 2, type: 'UPI Payment'
    },
    {
      id: 3, type: 'Credit / Debit Card'
    },
    {
      id: 4, type: 'NetBanking'
    },
  ];


  constructor(private _cartService: CartService) { }
  ngOnInit() {
    this.subscription = this
      ._cartService
      .CartState
      .subscribe((state: CartState) => {
        this.totalAmount = 0;
        this.products = state.products;
        this.products.map(x => this.totalAmount += x.amount);
      });

  }
  ngOnDestroy() {
    this
      .subscription
      .unsubscribe();
      this.products=[];
      this._cartService.removeProducts();
  }

  getRouterLink(item: any): any {
    switch (item.id) {
      case 1: return "/test-faces";
      default: return "/Home"
    }
  }

  checkout(): void {
    this.isPaymentShow = true;
  }

}
