import './scss/styles.scss';
import { Basket } from './components/base/Models/Basket';
import { Buyer } from './components/base/Models/Buyer';
import { Catalog } from './components/base/Models/Catalog';
import { apiProducts } from './utils/data';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';


const catalogModel = new Catalog();
catalogModel.save(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getAll())

const basketModel = new Basket();
basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Итоговая сумма:', basketModel.getPrice());

const buyerModel = new Buyer();
buyerModel.saveBuyerData({email:'test@mail.ru', address:'ул. Ленина'})
console.log('Данные покупателя:',buyerModel.getBuyerData());
console.log('Ошибки валидации (должны быть phone и payment):',buyerModel.validate());

const baseApi = new Api(API_URL); 
const larekApi = new WebLarekApi(baseApi, CDN_URL);   

larekApi.getProducts()
    .then(products => {
        // Сохраняем реальные данные с сервера в модель
        catalogModel.save(products);
        
        console.log('--- ДАННЫЕ С СЕРВЕРА ЗАГРУЖЕНЫ ---');
        console.log('Каталог из модели (с сервера):', catalogModel.getAll());
    })
    .catch(err => {
        console.error('Ошибка загрузки данных:', err);
    });