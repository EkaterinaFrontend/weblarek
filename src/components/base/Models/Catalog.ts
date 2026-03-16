import { IProduct } from "../../../types";

export class Catalog{
    list:IProduct[] = []
    
    currentProduct:IProduct | null = null
    save(arr:IProduct[]):void{
        this.list = arr;
    }
    getAll():IProduct[]{
        return this.list;
        
    }
    getProductById(id:string):IProduct | null{
       const foundItem = this.list.find(item => item.id === id);
       return foundItem || null;
    }
    saveProduct(product:IProduct | null):void{
        this.currentProduct = product;
    }
    getProducts():IProduct | null{
        return this.currentProduct;
    }
}