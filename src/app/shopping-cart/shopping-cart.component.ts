import { Component, Input, OnInit } from '@angular/core';
import { product, productsCollection } from '../product';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  products : any[];
  constructor() { }

  ngOnInit() {
    this.products = productsCollection;
  }

}
