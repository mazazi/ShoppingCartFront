import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from 'src/app/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatDividerModule,MatFormFieldModule, MatInputModule,MatButtonModule,
    FormsModule, ReactiveFormsModule,RouterModule,MatSlideToggleModule
  ],
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent {
  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(500)]],
    price: ['', [Validators.required]],
    qty: ['', [Validators.required]],
    isVisible: [true],
  });

  proId: number | null= null;
  product: Partial<Product> = {isVisible: true };

  constructor(private fb: FormBuilder, private productService: ProductService, 
    private toastr: ToastrService, private router: Router, private route : ActivatedRoute) {
  }

  async ngOnInit() { 
    await this.loadProductInfo();
  }

  async loadProductInfo() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.proId = idParam !== null ? +idParam : null; // Convert string to number      console.log(this.proId); // Do something with the id
    });
    if (!this.proId) {
      return;
    }

    await this.productService.getProduct(this.proId).subscribe((res) => {
      this.product = (res as any);
      if (!this.product) {
        this.toastr.error("Can't find a user with the specific id");
        this.navigateToListingPage();
      }  
    });
  }

  onSubmit() { 

    if (this.productForm.invalid) {
      this.toastr.error("Please fill the required data!");
      return;
    }

    this.productService.saveProduct(this.product).subscribe(result => {
      this.toastr.success("Product has been Saved!");
      this.navigateToListingPage();
    }, error => {
      this.toastr.error(error);
    });
  }

  navigateToListingPage() {
    this.router.navigate(['/products']);
  }


}
