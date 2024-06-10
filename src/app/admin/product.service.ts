import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Product, SuccessPagedResult } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  resourceUrl = environment.apiUrl;
  productUrl = this.resourceUrl + 'product';

  constructor(private httpClient: HttpClient) { }

  getProducts(
    name: string,
    pageSize: number,
    pageIndex: number
  ): Observable<SuccessPagedResult<Product>> {
    let url =
      this.productUrl +
      `/all?page=${pageIndex}&pageSize=${pageSize}`;
    if (name) url += `&name=${name}`;

    return this.httpClient.get<SuccessPagedResult<Product>>(url);
  }

  getProductsForShoppingCart(
    name: string,
    pageSize: number,
    pageIndex: number
  ): Observable<SuccessPagedResult<Product>> {
    let url =
      this.productUrl +
      `/GetAllWithPager?page=${pageIndex}&pageSize=${pageSize}`;
    if (name) url += `&name=${name}`;

    return this.httpClient.get<SuccessPagedResult<Product>>(url);
  }

  deleteProduct(type: Partial<Product>) {
    return this.httpClient.post(
      this.productUrl + '/' + type.id + '/DeActivate',
      type
    );
  }

  deActivateProduct(type: Partial<Product>) {
    return this.httpClient.post(
      this.productUrl + '/' + type.id + '/DeActivate',
      type
    );
  }

  activateProduct(type: Partial<Product>) {
    return this.httpClient.post(
      this.productUrl + '/' + type.id + '/Activate',
      type
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(this.productUrl + '/' + id + '/Get');
  }

  saveProduct(emp: Partial<Product>) {
    if (emp.id && emp.id > 0)
      return this.httpClient.post(
        this.productUrl + '/' + emp.id + '/Edit',
        emp
      );
    else return this.httpClient.post(this.productUrl + '/Save', emp);
  }
}
