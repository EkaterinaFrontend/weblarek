import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants.ts';
import { Api } from './components/base/Api.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { Catalog } from './components/Models/Catalog.ts';


const catalogModel = new Catalog();
catalogModel.save(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getAll())

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
console.log('Количество товаров после удаления:', basketModel.getCountProduct());

basketModel.clear();
console.log('Список товаров после очистки корзины:', basketModel.getItems());
console.log('Количество товаров после очистки:', basketModel.getCountProduct());

const buyerModel = new Buyer();
buyerModel.saveBuyerData({email:'test@mail.ru', address:'ул. Ленина'})
console.log('Данные покупателя:',buyerModel.getBuyerData());
console.log('Ошибки валидации (должны быть phone и payment):',buyerModel.validate());

const baseApi = new Api(API_URL); 
const larekApi = new WebLarekApi(baseApi, CDN_URL);   
 
basketModel.clear();
console.log('--- ТЕСТ ПОСЛЕ ОЧИСТКИ КОРЗИНЫ ---');
console.log('Список товаров (должен быть []):', basketModel.getItems());
console.log('Количество товаров (должно быть 0):', basketModel.getCountProduct());
console.log('Итоговая сумма (должна быть 0):', basketModel.getPrice());

buyerModel.clearBuyerData();
console.log('--- ТЕСТ ПОСЛЕ ОЧИСТКИ ПОКУПАТЕЛЯ ---');
console.log('Данные покупателя (должны быть пустые):', buyerModel.getBuyerData());
console.log('Валидность после очистки (должна быть false):', buyerModel.isValid());

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