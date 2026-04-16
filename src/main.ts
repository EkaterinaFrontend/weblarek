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
import { Card } from './components/view/Card.ts'
import { Contacts } from './components/view/Contacts.ts';
import { Modal } from './components/view/Modal.ts';
import { Order } from './components/view/Order.ts';
import { Page } from './components/view/Page.ts';
import { Success } from './components/Models/Success.ts';

// Инициализация базовых инструментов
const events = new EventEmitter();
const baseApi = new Api(API_URL); 
const api = new WebLarekApi(baseApi, CDN_URL);

// Инициализация Моделей данных
const catalogModel = new Catalog(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Находим шаблоны в HTML
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Инициализация переиспользуемых View
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);

// Загрузка товаров с сервера и отрисовка на главной
api.getProducts()
.then(products => {
    catalogModel.save(products);
      page.catalog = products.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
})
  
.catch(err => console.error(err));

 //Рендер каталога
 events.on('items:change', (items:IProduct[]) => {
    page.catalog = items.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick:() => catalogModel.saveProduct(item)
        });
        return card.render(item);
    });
 });


// Обработка клика по карточке — открытие модалки с подробным описанием  
events.on('card:select', (item: IProduct) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('product:add', item);
            modal.close();
        }
    });
    modal.render({
        content: card.render(item)
    });
});

//  Реакция на изменения в корзине 
events.on('basket:changed', (items:IProduct[]) => {
    page.counter = items.length;

    const basketItems = items.map((item, index) => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => basketModel.delete(item.id)
        });
        const element = card.render(item);
        const indexEl = element.querySelector('.basket__item-index') as HTMLElement;
        if (indexEl) indexEl.textContent = String(index + 1);
        return element;
    })
})

// Добавление товара в корзину
events.on('product:add', (item:IProduct) => {
    basketModel.add(item);
    page.counter = basketModel.getCountProduct();
    modal.close();
});

// Блокировка прокрутки при открытии модалки
events.on('modal:open', () => {
    page.locked = true;
});
events.on('modal:close', () => {
    page.locked = false;
});

// Открытие корзины
events.on('basket:open', () => {
    const items = basketModel.getItems().map((item, index) => {
        const card = new Card('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('product:delete', item)
        });
        
        // Проставляем порядковый номер в корзине
        const cardElement = card.render(item); 

        const indexElement = cardElement.querySelector('.basket__item-index') as HTMLElement;
        if (indexElement) indexElement.textContent = String(index + 1);
        return cardElement;
    });

    modal.render({
        content: basketView.render({
            items,
            total: basketModel.getPrice()
        })
    });
});

// Удаление из корзины
events.on('product:delete', (item: IProduct) => {
    basketModel.delete(item.id);
    page.counter = basketModel.getCountProduct();
    events.emit('basket:open'); 
});

// Переход к оформлению 
events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            address: '',
            payment: 'card',
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
    
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            address: '', 
            payment: 'card',
            valid: false,
            errors: []
        })
    });
});

// Валидация полей в реальном времени
events.on('formErrors:change', (errors:Partial<IBuyer>) => {
    const{ email, phone, address, payment } = errors;
    orderForm.valid = !address && !payment;
    orderForm.errors = Object.values({ payment, address}).filter(i => !!i).join('; ');


    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Универсальный слушатель изменений в полях
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.setBuyerField(data.field, data.value);
});


// Финальная оплата (отправка заказа)
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
                    page.counter = 0;
                    buyerModel.clearBuyerData();
                }
            });
            modal.render({
                content:success.render({ total: result.total})
            });
        })
        .catch(err => console.error(err));
});

// Управление скроллом страницы
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

//  ТЕСТ КАТАЛОГА (ЛОКАЛЬНЫЙ) 
catalogModel.save(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getAll())

// ТЕСТ поиск и выбор продукта на локальных данных
const localId = apiProducts.items[0].id;
const localProduct = catalogModel.getProductById(localId);
console.log(`Поиск локального товара по ID (${localId}):`, localProduct);

catalogModel.saveProduct(localProduct);
console.log('Текущий выбранный продукт (локально):', catalogModel.getProduct());

// ТЕСТ КОРЗИНЫ 
basketModel.add(apiProducts.items[0]);

console.log('Товары в корзине:', basketModel.getItems());
console.log('Итоговая сумма:', basketModel.getPrice());
console.log('Количество товаров в корзине:', basketModel.getCountProduct());
const idToDelete = apiProducts.items[0].id;
console.log(`Товар с ID ${idToDelete} есть в корзине?`, basketModel.hasProduct(idToDelete));

basketModel.delete(idToDelete);
console.log(`Список товаров после удаления товара с ID ${idToDelete}:`, basketModel.getItems());

basketModel.clear();
console.log('Список товаров после очистки корзины:', basketModel.getItems());
console.log('Количество товаров после очистки:', basketModel.getCountProduct());

// ТЕСТ ПОКУПАТЕЛЯ 
buyerModel.saveBuyerData({email:'test@mail.ru', address:'ул. Ленина'})
console.log('Данные покупателя:',buyerModel.getBuyerData());
console.log('Ошибки валидации (должны быть phone и payment):',buyerModel.validate());


basketModel.clear();
console.log('--- ТЕСТ ПОСЛЕ ОЧИСТКИ КОРЗИНЫ ---');
console.log('Список товаров (должен быть []):', basketModel.getItems());
console.log('Количество товаров (должно быть 0):', basketModel.getCountProduct());
console.log('Итоговая сумма (должна быть 0):', basketModel.getPrice());

buyerModel.clearBuyerData();
console.log('--- ТЕСТ ПОСЛЕ ОЧИСТКИ ПОКУПАТЕЛЯ ---');
console.log('Данные покупателя (должны быть пустые):', buyerModel.getBuyerData());
console.log('Валидность после очистки (должна быть false):', buyerModel.isValid());

// Сетевые данные (логирование)
api.getProducts()
    .then(products => {
        console.log('--- ДАННЫЕ С СЕРВЕРА ЗАГРУЖЕНЫ (ТЕСТ) ---');   
        console.log('Количество товаров:', products.length);
    });