import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { Component } from "../base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void; 
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container); 

        this._title = container.querySelector(`.${blockName}__title`) as HTMLElement;
        this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
    }
 

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }
}

export class CardCatalog extends Card{
     protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container);
        this._image = container.querySelector(`.card__image`) as HTMLImageElement;
        this._category = container.querySelector(`.card__category`) as HTMLElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
}

set image(value:string){
    this.setImage(this._image, value, this.title);
}
   
set category(value:string){
    this.setText(this._category,value);
    this.toggleClass(this._category, categoryMap[value as keyof typeof categoryMap],true);
}
}

export class CardPreview extends CardCatalog {
    protected _text:HTMLElement;
    protected _button:HTMLButtonElement;

    constructor(container:HTMLElement,actions?:ICardActions){
        super(container);
        this._text = container.querySelector(`.card__text`) as HTMLElement;
        this._button = container.querySelector(`.card__button`) as HTMLButtonElement;

        if(actions?.onClick){
             this._button.addEventListener('click', actions.onClick);
        }
    }
    set text(value:string){
        this.setText(this._text, value);
    }
    set buttonText(value:string){
        this.setText(this._button, value);
    }
     set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        }
    }
}

export class CardBasket extends Card {
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container:HTMLElement,actions?:ICardActions){
        super('card',container);
        this._button = container.querySelector(`.card__button`) as HTMLButtonElement;
        this._index = container.querySelector(`.basket__item-index`) as HTMLElement;

        if(actions?.onClick){
            this._button.addEventListener('click', actions.onClick);
        }
    }
     set index(value: number) {
        this.setText(this._index, String(value));
    }
}







   