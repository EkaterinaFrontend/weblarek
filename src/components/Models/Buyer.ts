import { IBuyer } from "../../types";
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer implements IBuyer{
    protected _payment: "card" | "cash" = "card";
    protected _email: string = "";
    protected _phone: string = "";
    protected _address: string = "";
    
    get payment() { return this._payment; }
    get email() { return this._email; }
    get phone() { return this._phone; }
    get address() { return this._address; }
    
    saveBuyerData(data: Partial<IBuyer>): void {
        Object.assign(this, data);
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