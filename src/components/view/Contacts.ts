import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "../Models/form";



export class Contacts extends Form<IBuyer> {
    constructor(container: HTMLFormElement, events: IEvents){
        super(container, events);
    }

    set email(value:string){
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
     set phone(value:string){
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
     }
}