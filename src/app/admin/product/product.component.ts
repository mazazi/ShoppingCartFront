import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmActionDialogComponent,
  DialogResult,
} from '../confirm-action-dialog-component/confirm-action-dialog-component.component';
import { Product } from 'src/app/models';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    ConfirmActionDialogComponent,
    MatDialogModule,
  ],

  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  displayedColumns = ['name', 'price', 'qty', 'isvisible', 'actions'];
  pageIndex: number = 0;
  pageSize: number = 10;
  dataSource = new MatTableDataSource();
  totalItems: number = 0;
  filter: {
    name?: string;
  } = {};

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    let name: string = this.filter.name!;
    this.productService
      .getProducts(name, this.pageSize, this.pageIndex)
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

  confirmDeleteProduct(f: Product) {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      data: {
        title: 'Confirm Deleting Product',
        message: 'Are you sure, you want to remove product?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DialogResult.Yes) {
        this.deleteProduct(f);
      }
    });
  }

  deleteProduct(pro: Product) {
    this.productService.deleteProduct(pro).subscribe(
      (data) => {
        this.toastr.success('Product deleted successfully');
        this.loadProducts();
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  onChange(event: any, selectedElement: Product) { 
    if (event.checked === true) {
      this.productService.activateProduct(selectedElement).subscribe(
        (data) => {
          this.toastr.success('Product Marked as visible successfully');
          this.loadProducts();
        },
        (error) => {
          this.toastr.error(error);
        }
      );
    } else {
      this.productService.deActivateProduct(selectedElement).subscribe(
        (data) => {
          this.toastr.success('Product Marked as not visible successfully');
          this.loadProducts();
        },
        (error) => {
          this.toastr.error(error);
        }
      );
    }
  }
}
