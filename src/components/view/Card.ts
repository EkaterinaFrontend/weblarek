import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { Component } from "../base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void; 
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _text?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container); 

        this._title = container.querySelector(`.${blockName}__title`) as HTMLElement;
        this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
        this._image = container.querySelector(`.${blockName}__image`) as HTMLImageElement;
        this._category = container.querySelector(`.${blockName}__category`) as HTMLElement;
        this._text = container.querySelector(`.${blockName}__text`) as HTMLElement;
        this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        if (this._button && value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
    }
    }

    set category(value: string) {
        if (this._category) {
        this.setText(this._category, value);
        if (categoryMap && value in categoryMap) {
            this.toggleClass(this._category, categoryMap[value as keyof typeof categoryMap], true);
        }
    }
}

    set text(value: string) {
        if (this._text) {
        this.setText(this._text, value);
    }    
}

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }
}
