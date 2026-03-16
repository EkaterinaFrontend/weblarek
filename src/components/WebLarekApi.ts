import { IApi, IProduct, IOrder, IOrderResult, IProductResponse } from '../types';

export class WebLarekApi {
    private _baseApi:IApi;
    readonly cdn:string;

    constructor(baseApi:IApi, cdn:string){
        this._baseApi = baseApi;
        this.cdn = cdn;
    }
    getProducts():Promise<IProduct[]> {
        return this._baseApi.get<IProductResponse>
        ('/product').then((data) => 
    
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
}
    orderProducts(order:IOrder):Promise<IOrderResult> {
        return this._baseApi.post<IOrderResult>('/order', order)
        .then((data)=> data);
    }
}