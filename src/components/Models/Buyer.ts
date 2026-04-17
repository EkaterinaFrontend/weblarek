import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    protected _payment: "card" | "cash" = "card";
    protected _email: string = "";
    protected _phone: string = "";
    protected _address: string = "";
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {}

     saveBuyerData(data: Partial<IBuyer>): void {
        if (data.payment) this._payment = data.payment;
        if (data.email) this._email = data.email;
        if (data.phone) this._phone = data.phone;
        if (data.address) this._address = data.address;
        this.events.emit('buyer:changed', this.getBuyerData());
    }


    setBuyerField(field: keyof IBuyer, value: string) { 
        if (field === 'payment') this._payment = value as "card" | "cash"; 
        else if (field === 'email') this._email = value; 
        else if (field === 'phone') this._phone = value; 
        else if (field === 'address') this._address = value; 

        this.events.emit('buyer:changed', this.getBuyerData());
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

 

    validate(): FormErrors{
        const errors:FormErrors = {};
        if(!this._email) errors.email = 'Необходимо указать email';
        if(!this._phone) errors.phone = 'Необходимо указать телефон';
        if(!this._address) errors.address = 'Необходимо указать адрес';
        if(!this._payment) errors.payment = 'Выберите способ оплаты';

        return errors;
    }
       isValid(): boolean {
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }
}


