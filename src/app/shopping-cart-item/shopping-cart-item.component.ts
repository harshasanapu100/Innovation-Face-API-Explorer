import { Component, Input, OnInit } from '@angular/core';
import { product } from '../product';
import { CartService } from '../services/cart.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent implements OnInit {
  @Input() product: any;
  constructor(private _cartService: CartService,
    private sharedService:SharedService) { }

  ngOnInit() {
  }

  AddProduct(_product: any) {
    this.sharedService.addCartAmount(_product.amount)
    this
      ._cartService
      .addProduct(_product);
  }
}
