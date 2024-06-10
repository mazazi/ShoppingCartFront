import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Cart, Product } from 'src/app/models';
import { ShoppingcartService } from '../shoppingcart.service';

@Component({
  selector: 'app-shoppingcart',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatFormFieldModule, MatCardModule,
    HttpClientModule, MatTableModule, MatPaginatorModule, MatSlideToggleModule,
    RouterModule, MatIconModule, FormsModule, ReactiveFormsModule, MatInputModule
  ],
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent {

  displayedColumns = ['name', 'price', 'actions'];
  pageIndex: number = 0;
  pageSize: number = 10;
  dataSource = new MatTableDataSource();
  totalItems: number = 0;
  filter: {
    name?: string;
  } = {};

  cartItems: Cart[] = [];

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private cartService: ShoppingcartService
  ) { }

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    let name: string = this.filter.name!;
    this.productService
      .getProductsForShoppingCart(name, this.pageSize, this.pageIndex)
      .subscribe((res) => {
        this.dataSource.data = (res.data as any).data;
        this.totalItems = (res.data as any).totalItems;
      });
  }

  pageChanged(pageChangedEvent: PageEvent) {
    this.pageSize = pageChangedEvent.pageSize;
    this.pageIndex = pageChangedEvent.pageIndex;
    this.loadProducts();
  }

  AddToCart(element: Product) {
    const item: Cart = {
      productId: element.id!,
      productName: element.name!,
      price: element.price!,
      qty: 1
    };

    const existingItem = this.cartItems.find(item => item.productId === element.id);
    if (existingItem) {
      existingItem.qty! += 1;
    } else {
      this.cartItems.push(item);
    }
  }

  get totalPrice(): number {
    let total = this.cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    return parseFloat(total.toFixed(2));
  }

  removeFromCart(product: Cart) {
    this.cartItems = this.cartItems.filter(item => item.productId !== product.productId);
  }

  CheckOut() {
    this.cartService.postCartItems(this.cartItems).subscribe(result => {
      const res: any = result; 
      if (res.succeeded === false) { 
        res.errors.forEach((err: string | undefined) => {
          this.toastr.error(err);
        });
      } else {
        this.toastr.success("Items have been checked out successfully!");
        setTimeout(() => {
          this.loadProducts();
          this.cartItems = [];
        }, 2000);
      }
    }, error => {
      this.toastr.error("An error occurred while processing your request. Please try again later.");
    });
  }
}
