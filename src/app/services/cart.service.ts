import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { product } from '../product';
import { CartState } from './cart-state';

@Injectable()
export class CartService {
  constructor(private httpclient: HttpClient) { }
  private cartSubject = new Subject<CartState>();
  Products: product[] = [];
  CartState = this.cartSubject.asObservable();
  baseURL: string = "http://localhost:5000";

  addProduct(_product: any) {
    this.Products.push(_product)
    this.cartSubject.next(<CartState>{ loaded: true, products: this.Products });
  }

  removeProducts() {
    this.Products = [];
    this.cartSubject.next(<CartState>{ loaded: false, products: this.Products });
  }

  getAllProducts(): Observable<any> {
    return this
      .httpclient
      .get(`${this.baseURL}/Items`)
      .pipe(
        map((res: Response) => res)
      )
  }
}
