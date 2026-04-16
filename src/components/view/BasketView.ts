import { Component } from "../base/Component";
import { IEvents } from "../base/Events";


interface IBasketView {
    items: HTMLElement [];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;


constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = container.querySelector('.basket__list') as HTMLElement;
    this._total = container.querySelector('.basket__price') as HTMLElement;
    this._button = container.querySelector('.basket__button') as HTMLButtonElement;

    this._button.addEventListener('click', () => {
        this.events.emit('order:open');
    });
     this.items = []; 
}

set items(items: HTMLElement[]){
    if(items.length > 0){
        this._list.replaceChildren(...items);
        this.setDisabled(this._button,false);
    }else {
        this._list.replaceChildren('Корзина пуста');
        this.setDisabled(this._button,true);
    }
}

set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}