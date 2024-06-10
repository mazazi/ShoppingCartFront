import { Route } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';
import { ShoppingcartComponent } from './shoppingcart/shoppingcart.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';

export const ADMIN_ROUTE: Route[] = [
  { path: '', redirectTo: '/home',pathMatch:'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductComponent },
  { path: 'cart', component: ShoppingcartComponent },
  {
    path: 'product/add',
    component: AddEditProductComponent,
  },
  {
    path: 'product/edit/:id',
    component: AddEditProductComponent,
  },

];
