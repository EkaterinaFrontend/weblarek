import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { Catalog } from './components/Models/Catalog.ts';

//  ТЕСТ КАТАЛОГА (ЛОКАЛЬНЫЙ) 
const catalogModel = new Catalog();
catalogModel.save(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getAll())

// ТЕСТ поиск и выбор продукта на локальных данных
const localId = apiProducts.items[0].id;
const localProduct = catalogModel.getProductById(localId);
console.log(`Поиск локального товара по ID (${localId}):`, localProduct);

catalogModel.saveProduct(localProduct);
console.log('Текущий выбранный продукт (локально):', catalogModel.getProduct());

// ТЕСТ КОРЗИНЫ 
const basketModel = new Basket();
basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[1]);
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
const buyerModel = new Buyer();
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

//  ТЕСТИРОВАНИЕ СЛОЯ API (СЕТЕВЫЕ ДАННЫЕ)

const baseApi = new Api(API_URL); 
const larekApi = new WebLarekApi(baseApi, CDN_URL);

larekApi.getProducts()
    .then(products => {
        catalogModel.save(products);
        console.log('--- ДАННЫЕ С СЕРВЕРА ЗАГРУЖЕНЫ ---');   
        console.log('Каталог из модели:', catalogModel.getAll());

        const firstProductId = products[0].id;
        const foundProduct = catalogModel.getProductById(firstProductId);
        console.log(`Поиск товара по ID (${firstProductId}):`, foundProduct);

        catalogModel.saveProduct(foundProduct);
        console.log('Текущий выбранный продукт (getProduct):', catalogModel.getProduct());
    })
    .catch(err => {
        console.error('Ошибка загрузки данных:', err);
    });