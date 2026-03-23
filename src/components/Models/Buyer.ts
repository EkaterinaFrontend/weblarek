import { IBuyer } from "../../types";
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    protected _payment: "card" | "cash" = "card";
    protected _email: string = "";
    protected _phone: string = "";
    protected _address: string = "";
    
    saveBuyerData(data: Partial<IBuyer>): void {
       if(data.payment) this._payment = data.payment;
       if(data.email) this._email = data.email;
       if(data.phone) this._phone = data.phone;
       if(data.address) this._address = data.address;
    }

    getBuyerData():IBuyer{
        return {
            payment:this._payment,
            email:this._email,
            phone:this._phone,
            address:this._address,
        };
    }

    clearBuyerData():void{
        this._payment = "card";
        this._email = "";
        this._phone = "";
        this._address = "";
    }

    validate(): FormErrors {
        const errors: FormErrors = {};
        
        if(!this._payment){
            errors.payment = "Не выбран вид оплаты";
        }
        if(!this._email){
            errors.email = "Укажите email";
        }
        if(!this._phone){
            errors.phone = "Укажите номер телефона";
        }
        if(!this._address){
            errors.address = "Укажите адрес доставки";
        }
        return errors;
    }
    isValid():boolean{
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }
  
}