import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  searchMode: boolean;
  products: Product[];
  currentCategoryId: number =1;
 previousCategoryId: number =1;
  currentCategoryName: string;
  thePagNumber: number =1;
  thePageSize: number =5;
  theTotalElements: number=0;
  previouskryword: string=null;

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(this.searchMode);

    if(this.searchMode){

      this.handleSearchProducts();
    }
    else{
    this.handleListProduct();
    }
  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    if(this.previouskryword != theKeyword){

      this.thePagNumber = 1;

    }
    this.previouskryword = theKeyword;
    this.productService.searchProductsPaginate(this.thePagNumber -1,
      this.thePageSize,theKeyword).subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageSize = data.page.size;
          this.thePagNumber=data.page.number + 1;
          this.theTotalElements=data.page.totalElements;
   
     });
  }

  handleListProduct(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId) {
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        this.currentCategoryName = this.route.snapshot.paramMap.get('name');
     }
     else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';

     }
     if(this.previousCategoryId!=this.currentCategoryId){
       this.thePagNumber =1;
     }
     this.previousCategoryId = this.currentCategoryId;
     console.log(`currentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePagNumber}`);
    
    this.productService.getProductListPaginate(this.thePagNumber -1,this.thePageSize,this.currentCategoryId).subscribe(
      data => {
       this.products = data._embedded.products;
       this.thePageSize = data.page.size;
       this.thePagNumber=data.page.number + 1;
       this.theTotalElements=data.page.totalElements;

  });
}
updatePageSize(pageSize:number){
  this.thePageSize = pageSize;
  this.thePagNumber = 1;
  this.listProducts();
}
addToCart(theProduct: Product){



  console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

  const theCartItem = new CartItem(theProduct);
  this.cartService.addToCart(theCartItem);

}

}
