import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export class Catalog{
    protected _list:IProduct[] = [];
    protected _currentProduct:IProduct | null = null;
    
    constructor(protected events: IEvents) {} 
    save(arr:IProduct[]):void{
        this._list = arr;
        this.events.emit('items:changed', this._list); 
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
         if (product) {
            this.events.emit('card:select', product);
        }
    }
    getProduct():IProduct | null{
        return this._currentProduct;
    }
}