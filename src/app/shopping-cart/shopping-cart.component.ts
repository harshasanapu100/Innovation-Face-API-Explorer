import { Component, Input, OnInit } from '@angular/core';
import { product, productsCollection } from '../product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  products: any[];
  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.products = [];
    this.cartService.getAllProducts().subscribe(items => {
      this.products = items;
    });
  }

}
