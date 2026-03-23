import { IProduct } from "../../types";


export class Catalog{
    protected _list:IProduct[] = [];
    protected _currentProduct:IProduct | null = null;
    
    currentProduct:IProduct | null = null
    save(arr:IProduct[]):void{
        this._list = arr;
    }
    getAll():IProduct[]{
        return this._list;
        
    }
    getProductById(id:string):IProduct | null{
       const foundItem = this._list.find(item => item.id === id);
       return foundItem || null;
    }
    saveProduct(product:IProduct | null):void{
        this._currentProduct = product;
    }
    getProduct():IProduct | null{
        return this._currentProduct;
    }
}