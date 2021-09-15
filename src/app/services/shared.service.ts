import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private cartBalance: number = 0;
  private totalBalance: number = 0;
 
  addCartAmount(amount: number) {
    this.cartBalance += amount;
  }

  getCartAmount(): number {
    return this.cartBalance;
  }

  setTotalBalance(amount: number) {
    this.totalBalance =amount;
  }

  getTotalBalance(): number {
    return this.totalBalance;
  }

  constructor() { }

}
