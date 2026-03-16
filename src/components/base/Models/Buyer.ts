import { IBuyer } from "../../../types";

export class Buyer implements IBuyer{
    payment: "card" | "cash" = "card";
    email: string = "";
    phone: string = "";
    address: string = "";
    
    saveBuyerData(data: Partial<IBuyer>): void {
        Object.assign(this, data);
    }

    getBuyerData():IBuyer{
        return {
            payment:this.payment,
            email:this.email,
            phone:this.phone,
            address:this.address,
        };
    }

    clearBuyerData():void{
        this.payment = "card";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    validate(): Partial<Record<keyof IBuyer, string>>{
        const errors:Partial<Record<keyof IBuyer, string>> = {};
        
        if(!this.payment){
            errors.payment = "Не выбран вид оплаты";
        }
        if(!this.email){
            errors.email = "Укажите email";
        }
        if(!this.phone){
            errors.phone = "Укажите номер телефона";
        }
        if(!this.address){
            errors.address = "Укажите адрес доставки";
        }
        return errors;
    }
    isValid():boolean{
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }
  
}