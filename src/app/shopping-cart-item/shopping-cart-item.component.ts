import { Component, Input, OnInit } from '@angular/core';
import { product } from '../product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent implements OnInit {
  @Input() product: any;
  constructor(private _cartService: CartService) { }

  ngOnInit() {
  }

  AddProduct(_product: product) {
    this
      ._cartService
      .addProduct(_product);
  }
}
