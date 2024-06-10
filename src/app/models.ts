export interface SuccessPagedResult<T> {
  data: PagedResult<T>[];
  succeeded: boolean;
  message?: string;
  errors?: string;
}

export interface PagedResult<T> {
  data: T[];
  pageIndex: number;
  totalItems: number;
}


export interface Product {
  id?: number;
  name?: string;
  price?: number;
  qty?: number;
  isVisible?: boolean;
}

export interface Cart {
  productId: number;
  productName: string;
  price: number;
  qty: number; 
}