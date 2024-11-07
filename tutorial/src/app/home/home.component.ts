import { Component, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from "../components/product/product.component";
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from "../components/edit-popup/edit-popup.component";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  constructor (
    private productsService: ProductsService
  ) { 

  }
  @ViewChild('paginator') paginator: Paginator | undefined; 
  products: Product[] = [];
  totalRecords: number = 0; 
  rows: number = 5; 

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false; 

  selectedProduct: Product = { 
    id: 0, 
    name: '', 
    image: '', 
    price: '', 
    rating: 0,
  }

  toggleEditPopup(product: Product) { 
    this.selectedProduct = product; 
    this.displayEditPopup = true; 
  }

  toggleDeletePopup(product: Product) { 
    this.deleteProduct(product?.id ?? 0); 
  }

  toggleAddPopup() { 
    this.displayAddPopup = true; 
  }

  onConfirmEdit(product: Product) { 
    this.editProduct(product); 
    this.displayEditPopup = false; 
  }

  onConfirmAdd(product: Product) { 
    this.addProduct(product); 
    this.displayAddPopup = false; 
  }

  fetchProducts(page: number, perPage: number) { 
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe(
        { 
          next: (data: Products) => { 
            this.products = data.items; 
            this.totalRecords = data.total; 
          }, 
          error: (error) => { 
            console.log(error); 
          }
        }
      )
  }

  editProduct(product: Product) { 
    this.productsService.editProduct(`http://localhost:3000/clothes/${product.id}`, product).subscribe(
      { 
        next: (data) => {
          console.log(data); 
        },
        error: (error) => { 
          console.log(error); 
        }
      }
    )
  }

  deleteProduct(id: number) { 
    this.productsService.deleteProduct(`http://localhost:3000/clothes/${id}`).subscribe(
      { 
        next: (data: Product) => { 
          console.log(data); 
          this.fetchProducts(0, this.rows); 
          this.resetPaginator(); 
        }, 
        error: (error) => { 
          console.log(error); 
        }
      }
    )
  }

  addProduct(product: Product) { 
    this.productsService.addProduct(`http://localhost:3000/clothes/`, product).subscribe(
      { 
        next: (data: Product) => { 
          console.log(data);
        },  
        error: (error) => { 
          console.log(error); 
        }
      }
    )
  }

  onPageChange(event: any) { 
    this.fetchProducts(event.page, event.rows); 
  } 

  resetPaginator () { 
    this.paginator?.changePage(0); 
  }

  ngOnInit () { 
    this.fetchProducts(0, this.rows); 
  }
}
    