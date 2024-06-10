import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cart, Product, SuccessPagedResult } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {
  resourceUrl = environment.apiUrl;
  cartUrl = this.resourceUrl + 'ShoppingCart';

  constructor(private httpClient: HttpClient) {}

  postCartItems(items: Cart[]): Observable<Cart[]> {
    return this.httpClient.post<Cart[]>(this.cartUrl + '/CheckOut', { items });
  }
}
