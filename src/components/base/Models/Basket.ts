import { IProduct } from "../../../types";

export class Basket{
   protected items: IProduct[] = [];
    
   getItems():IProduct[]{
    return this.items;
   }
   
   add(product:IProduct):void{
        this.items.push(product);
   }
   delete(id:string):void{
    this.items = this.items.filter(item => item.id !== id);
   }

   clear():void{
    this.items = [];
   }

   getPrice():number{
    let sum = 0;
    for(let item of this.items){
        sum += item.price || 0
    }
    return sum;
   }

   getCountProduct():number{
        return this.items.length;
   }

   hasProduct(id:string):boolean{
    return this.items.some(item => item.id === id);
   }
}
