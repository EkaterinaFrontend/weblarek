import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket{
   protected items: IProduct[] = [];
    
constructor(protected events: IEvents) {}
   getItems():IProduct[]{
    return this.items;
   }
   
   add(product:IProduct):void{
        this.items.push(product);
        this.events.emit('basket:changed', this.items);
   }
   delete(id:string):void{
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:changed', this.items);
   }

   clear():void{
    this.items = [];
    this.events.emit('basket:changed', this.items);
   }

   getPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
}


   getCountProduct():number{
        return this.items.length;
   }

   hasProduct(id:string):boolean{
    return this.items.some(item => item.id === id);
   }
}
