import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { product } from '../product';
import { CartState } from './cart-state';
import { environment } from './../../environments/environment';

@Injectable()
export class CartService {
  constructor(private httpclient: HttpClient) { }
  private cartSubject = new Subject<CartState>();
  Products: product[] = [];
  CartState = this.cartSubject.asObservable();
  baseURL: string = environment.baseURL;

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

  checkOutCart(data: any): Observable<any> {
    return this
      .httpclient
      .post(`${this.baseURL}/Payment`, data)
      .pipe(
        map((res: Response) => res)
      )
  }
}
