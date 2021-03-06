/**
 * Ipoh Drum Laravel API
 * This is a swagger-generated API documentation for the project Ipoh Drum. (Only supports OpenAPI Annotations for now.)
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: henry_lcz97@hotmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';


import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable({
  providedIn: 'root'
})
export class InventoryControllerServiceService {

    protected basePath = 'http://172.104.45.205';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Creates a inventory.
     * @param name Inventoryname
     * @param store_id Store ID
     * @param inventoryfamilies Inventory Families
     * @param cost Product Cost
     * @param price Product Base Price
     * @param product_promotion_id Promotion ID
     * @param warranty_id Warranty ID
     * @param shipping_id Shipping ID
     * @param code Code
     * @param sku Sku
     * @param desc Product Description
     * @param stockthreshold Stock Threshold
     * @param img Image
     * @param sliders Sliders Image
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createInventory(name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, img?: Array<Blob>, sliders?: Array<Blob>, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public createInventory(name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, img?: Array<Blob>, sliders?: Array<Blob>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public createInventory(name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, img?: Array<Blob>, sliders?: Array<Blob>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public createInventory(name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, img?: Array<Blob>, sliders?: Array<Blob>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createInventory.');
        }
        if (store_id === null || store_id === undefined) {
            throw new Error('Required parameter store_id was null or undefined when calling createInventory.');
        }
        if (inventoryfamilies === null || inventoryfamilies === undefined) {
            throw new Error('Required parameter inventoryfamilies was null or undefined when calling createInventory.');
        }
        if (cost === null || cost === undefined) {
            throw new Error('Required parameter cost was null or undefined when calling createInventory.');
        }
        if (price === null || price === undefined) {
            throw new Error('Required parameter price was null or undefined when calling createInventory.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (store_id !== undefined && store_id !== null) {
            queryParameters = queryParameters.set('store_id', <any>store_id);
        }
        if (product_promotion_id !== undefined && product_promotion_id !== null) {
            queryParameters = queryParameters.set('product_promotion_id', <any>product_promotion_id);
        }
        if (warranty_id !== undefined && warranty_id !== null) {
            queryParameters = queryParameters.set('warranty_id', <any>warranty_id);
        }
        if (shipping_id !== undefined && shipping_id !== null) {
            queryParameters = queryParameters.set('shipping_id', <any>shipping_id);
        }
        if (inventoryfamilies !== undefined && inventoryfamilies !== null) {
            queryParameters = queryParameters.set('inventoryfamilies', <any>inventoryfamilies);
        }
        if (code !== undefined && code !== null) {
            queryParameters = queryParameters.set('code', <any>code);
        }
        if (sku !== undefined && sku !== null) {
            queryParameters = queryParameters.set('sku', <any>sku);
        }
        if (desc !== undefined && desc !== null) {
            queryParameters = queryParameters.set('desc', <any>desc);
        }
        if (cost !== undefined && cost !== null) {
            queryParameters = queryParameters.set('cost', <any>cost);
        }
        if (price !== undefined && price !== null) {
            queryParameters = queryParameters.set('price', <any>price);
        }
        if (stockthreshold !== undefined && stockthreshold !== null) {
            queryParameters = queryParameters.set('stockthreshold', <any>stockthreshold);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: this.encoder});
        }

        if (img) {
            if (useForm) {
                img.forEach((element) => {
                    formParams = formParams.append('img', <any>element) as any || formParams;
            })
            } else {
                formParams = formParams.append('img', img.join(COLLECTION_FORMATS['csv'])) as any || formParams;
            }
        }
        if (sliders) {
            if (useForm) {
                sliders.forEach((element) => {
                    formParams = formParams.append('sliders[]', <any>element) as any || formParams;
            })
            } else {
                formParams = formParams.append('sliders[]', sliders.join(COLLECTION_FORMATS['csv'])) as any || formParams;
            }
        }

        return this.httpClient.post<any>(`${this.configuration.basePath}/api/inventory`,
            convertFormParamsToString ? formParams.toString() : formParams,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Set inventory\&#39;s \&#39;status\&#39; to 0.
     * @param uid Inventory ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteInventoryByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteInventoryByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteInventoryByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteInventoryByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling deleteInventoryByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.delete<any>(`${this.configuration.basePath}/api/inventory/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Filter list of inventories
     * Returns list of filtered inventories
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param keyword Keyword for filter
     * @param fromdate From Date for filter
     * @param todate To date for filter
     * @param onsale On sale for filter
     * @param status status for filter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public filterInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, onsale?: string, status?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public filterInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, onsale?: string, status?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public filterInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, onsale?: string, status?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public filterInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, onsale?: string, status?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page_number !== undefined && page_number !== null) {
            queryParameters = queryParameters.set('pageNumber', <any>page_number);
        }
        if (page_size !== undefined && page_size !== null) {
            queryParameters = queryParameters.set('pageSize', <any>page_size);
        }
        if (keyword !== undefined && keyword !== null) {
            queryParameters = queryParameters.set('keyword', <any>keyword);
        }
        if (fromdate !== undefined && fromdate !== null) {
            queryParameters = queryParameters.set('fromdate', <any>fromdate);
        }
        if (todate !== undefined && todate !== null) {
            queryParameters = queryParameters.set('todate', <any>todate);
        }
        if (onsale !== undefined && onsale !== null) {
            queryParameters = queryParameters.set('onsale', <any>onsale);
        }
        if (status !== undefined && status !== null) {
            queryParameters = queryParameters.set('status', <any>status);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/filter/inventory`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Filter onsale inventories.
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param keyword Keyword for filter
     * @param fromdate From Date for filter
     * @param todate To string for filter
     * @param status status for filter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public filterOnSaleInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public filterOnSaleInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public filterOnSaleInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public filterOnSaleInventories(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page_number !== undefined && page_number !== null) {
            queryParameters = queryParameters.set('pageNumber', <any>page_number);
        }
        if (page_size !== undefined && page_size !== null) {
            queryParameters = queryParameters.set('pageSize', <any>page_size);
        }
        if (keyword !== undefined && keyword !== null) {
            queryParameters = queryParameters.set('keyword', <any>keyword);
        }
        if (fromdate !== undefined && fromdate !== null) {
            queryParameters = queryParameters.set('fromdate', <any>fromdate);
        }
        if (todate !== undefined && todate !== null) {
            queryParameters = queryParameters.set('todate', <any>todate);
        }
        if (status !== undefined && status !== null) {
            queryParameters = queryParameters.set('status', <any>status);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/inventories/onsale/filter`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get list of inventories
     * Returns list of inventories
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getInventories(page_number?: number, page_size?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getInventories(page_number?: number, page_size?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getInventories(page_number?: number, page_size?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getInventories(page_number?: number, page_size?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (page_number !== undefined && page_number !== null) {
            queryParameters = queryParameters.set('pageNumber', <any>page_number);
        }
        if (page_size !== undefined && page_size !== null) {
            queryParameters = queryParameters.set('pageSize', <any>page_size);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/inventory`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieves inventory by Uid.
     * @param uid Inventory_ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getInventoryByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getInventoryByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getInventoryByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getInventoryByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling getInventoryByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/inventory/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Retrieves onsale inventory by Uid.
     * @param uid Inventory_ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getOnSaleInventoryByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getOnSaleInventoryByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getOnSaleInventoryByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getOnSaleInventoryByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling getOnSaleInventoryByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/inventory/${encodeURIComponent(String(uid))}/onsale`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update inventory by Uid.
     * @param uid Inventory_ID, NOT \&#39;ID\&#39;.
     * @param name Inventoryname
     * @param store_id Store ID
     * @param inventoryfamilies Inventory Families
     * @param cost Product Cost
     * @param price Product Selling Price
     * @param qty Stock Qty
     * @param onsale On Sale
     * @param product_promotion_id Promotion ID
     * @param warranty_id Warranty ID
     * @param shipping_id Shipping ID
     * @param code Code
     * @param sku Sku
     * @param desc Product Description
     * @param stockthreshold Stock Threshold
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateInventoryByUid(uid: string, name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, qty: number, onsale: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateInventoryByUid(uid: string, name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, qty: number, onsale: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateInventoryByUid(uid: string, name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, qty: number, onsale: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateInventoryByUid(uid: string, name: string, store_id: number, inventoryfamilies: string, cost: number, price: number, qty: number, onsale: number, product_promotion_id?: number, warranty_id?: number, shipping_id?: number, code?: string, sku?: string, desc?: string, stockthreshold?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling updateInventoryByUid.');
        }
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling updateInventoryByUid.');
        }
        if (store_id === null || store_id === undefined) {
            throw new Error('Required parameter store_id was null or undefined when calling updateInventoryByUid.');
        }
        if (inventoryfamilies === null || inventoryfamilies === undefined) {
            throw new Error('Required parameter inventoryfamilies was null or undefined when calling updateInventoryByUid.');
        }
        if (cost === null || cost === undefined) {
            throw new Error('Required parameter cost was null or undefined when calling updateInventoryByUid.');
        }
        if (price === null || price === undefined) {
            throw new Error('Required parameter price was null or undefined when calling updateInventoryByUid.');
        }
        if (qty === null || qty === undefined) {
            throw new Error('Required parameter qty was null or undefined when calling updateInventoryByUid.');
        }
        if (onsale === null || onsale === undefined) {
            throw new Error('Required parameter onsale was null or undefined when calling updateInventoryByUid.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (store_id !== undefined && store_id !== null) {
            queryParameters = queryParameters.set('store_id', <any>store_id);
        }
        if (product_promotion_id !== undefined && product_promotion_id !== null) {
            queryParameters = queryParameters.set('product_promotion_id', <any>product_promotion_id);
        }
        if (warranty_id !== undefined && warranty_id !== null) {
            queryParameters = queryParameters.set('warranty_id', <any>warranty_id);
        }
        if (shipping_id !== undefined && shipping_id !== null) {
            queryParameters = queryParameters.set('shipping_id', <any>shipping_id);
        }
        if (inventoryfamilies !== undefined && inventoryfamilies !== null) {
            queryParameters = queryParameters.set('inventoryfamilies', <any>inventoryfamilies);
        }
        if (code !== undefined && code !== null) {
            queryParameters = queryParameters.set('code', <any>code);
        }
        if (sku !== undefined && sku !== null) {
            queryParameters = queryParameters.set('sku', <any>sku);
        }
        if (desc !== undefined && desc !== null) {
            queryParameters = queryParameters.set('desc', <any>desc);
        }
        if (cost !== undefined && cost !== null) {
            queryParameters = queryParameters.set('cost', <any>cost);
        }
        if (price !== undefined && price !== null) {
            queryParameters = queryParameters.set('price', <any>price);
        }
        if (qty !== undefined && qty !== null) {
            queryParameters = queryParameters.set('qty', <any>qty);
        }
        if (stockthreshold !== undefined && stockthreshold !== null) {
            queryParameters = queryParameters.set('stockthreshold', <any>stockthreshold);
        }
        if (onsale !== undefined && onsale !== null) {
            queryParameters = queryParameters.set('onsale', <any>onsale);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.put<any>(`${this.configuration.basePath}/api/inventory/${encodeURIComponent(String(uid))}`,
            null,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Change inventory Thumbnail by Uid.
     * @param inventory_id Inventory Id
     * @param img Image
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadInventoryThumbnail(inventory_id: number, img?: Array<Blob>, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public uploadInventoryThumbnail(inventory_id: number, img?: Array<Blob>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public uploadInventoryThumbnail(inventory_id: number, img?: Array<Blob>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public uploadInventoryThumbnail(inventory_id: number, img?: Array<Blob>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (inventory_id === null || inventory_id === undefined) {
            throw new Error('Required parameter inventory_id was null or undefined when calling uploadInventoryThumbnail.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (inventory_id !== undefined && inventory_id !== null) {
            queryParameters = queryParameters.set('inventory_id', <any>inventory_id);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: this.encoder});
        }

        if (img) {
            if (useForm) {
                img.forEach((element) => {
                    formParams = formParams.append('img', <any>element) as any || formParams;
            })
            } else {
                formParams = formParams.append('img', img.join(COLLECTION_FORMATS['csv'])) as any || formParams;
            }
        }

        return this.httpClient.post<any>(`${this.configuration.basePath}/api/thumbnailupload/inventory`,
            convertFormParamsToString ? formParams.toString() : formParams,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
