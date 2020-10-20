import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';
  constructor(private httpClient: HttpClient) {}

getProductList(theCategoryId: number): Observable<Product[]>{
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
      return this.httpClient.get<GetResponse>(searchUrl).pipe(

        map(response => response._embedded.products)
      );
    

   }
   getProductListPaginate(thePage: number,thePageSize: number,theCategoryId): Observable<GetResponse>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`+`&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
  

 }

searchProducts(theKeyword: string): Observable<Product[]> {
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
  return this.httpClient.get<GetResponse>(searchUrl).pipe(

    map(response => response._embedded.products)
  );
  }
searchProductsPaginate(thePage: number,thePageSize: number,theKeyword: string): Observable<GetResponse>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+`&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponse>(searchUrl);
  

 }
getProduct(theProductId: number): Observable<Product> {
  const productUrl = `${this.baseUrl}/${theProductId}`;
   return this.httpClient.get<Product>(productUrl);
  }
getProductCategories(): Observable<ProductCategory[]> {
  return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(

    map(response => response._embedded.productCategory)
  );

  }
  }
interface GetResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements:number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}