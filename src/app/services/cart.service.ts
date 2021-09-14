import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { product } from '../product';
import { CartState } from './cart-state';

@Injectable()
export class CartService {
  constructor(private httpclient: HttpClient) { }
  private cartSubject = new Subject<CartState>();
  Products: product[] = [];
  CartState = this.cartSubject.asObservable();

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
      .get('')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw('Server error'));
  }
}
