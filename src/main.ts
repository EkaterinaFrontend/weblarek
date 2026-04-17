import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { Catalog } from './components/Models/Catalog.ts';
import { cloneTemplate } from './utils/utils.ts';
import { IBuyer, IProduct } from './types/index.ts';
import { EventEmitter } from './components/base/Events.ts';

import { BasketView } from './components/view/BasketView.ts';
import { CardCatalog, CardPreview, CardBasket } from './components/view/Card.ts';
import { Contacts } from './components/view/Contacts.ts';
import { Modal } from './components/view/Modal.ts';
import { Order } from './components/view/Order.ts';
import { Success } from './components/Models/Success.ts';
import { Gallery } from './components/view/Gallery.ts';
import { Header } from './components/view/Header.ts';




// Инициализация базовых инструментов
const events = new EventEmitter();
const baseApi = new Api(API_URL); 
const api = new WebLarekApi(baseApi, CDN_URL);

// Инициализация Моделей данных
const catalogModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const headerElement = document.querySelector('.header') as HTMLElement;
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const wrapper = document.querySelector('.page__wrapper') as HTMLElement;
 const modalContainer = document.querySelector('#modal-container') as HTMLElement;
 

// Находим шаблоны в HTML
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
 
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalContainer, events);


// Инициализация переиспользуемых View
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

// Загрузка товаров
api.getProducts()
    .then(products => catalogModel.save(products))
    .catch(err => console.error(err));

// Рендер каталога
events.on('items:changed', (items: IProduct[]) => {
    gallery.catalog = items.map(item => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
});

// Открытие превью
events.on('card:select', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (basketModel.hasProduct(item.id)) {
                basketModel.delete(item.id);
                card.buttonText = 'В корзину';
            } else {
                basketModel.add(item);
                card.buttonText = 'Удалить';
            }
        }
    });
        // Устанавливаем текст кнопки отдельно через сеттер
    card.buttonText = basketModel.hasProduct(item.id) ? 'Удалить' : 'В корзину';
    modal.render({
        content: card.render(item)
    });
});

// Реакция на изменения в корзине
events.on('basket:changed', (items: IProduct[]) => {
    header.counter = items.length;
    const basketItems = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item)
        });
        card.index = index + 1;
        return card.render({
            title: item.title,
            price: item.price,
        });
    });
    basketView.render({
        items: basketItems,
        total: basketModel.getPrice()
    });
});

events.on('basket:remove', (item: IProduct) => {
    basketModel.delete(item.id);
});

// Работа с формами и Buyer
events.on('buyer:changed', () => {
    const errors = buyerModel.validate();
    const data = buyerModel.getBuyerData();

    orderForm.render({
        ...data,
        valid: !errors.address && !errors.payment,
        errors: Object.values({ payment: errors.payment, address: errors.address }).filter(Boolean) as string[] 
    });

    contactsForm.render({
        ...data,
        valid: !errors.email && !errors.phone,
        errors: Object.values({ phone: errors.phone, email: errors.email }).filter(Boolean) as string[] 
    });
});

events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.setBuyerField(data.field, data.value);
});

// Навигация
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({ ...buyerModel.getBuyerData(), valid: false, errors: [] })
    });
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({ ...buyerModel.getBuyerData(), valid: false, errors: [] })
    });
});

// Оплата
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getBuyerData(),
        total: basketModel.getPrice(),
        items: basketModel.getItems().map(item => item.id)
    };
    api.postOrder(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    basketModel.clear();
                    buyerModel.clearBuyerData();
                }
            });
            modal.render({ content: success.render({ total: result.total }) });
        })
        .catch(err => console.error(err));
});

// Скролл
events.on('modal:open', () => wrapper.classList.add('page__wrapper_locked'));
events.on('modal:close', () => wrapper.classList.remove('page__wrapper_locked'));