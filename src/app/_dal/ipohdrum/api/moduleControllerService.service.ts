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
export class ModuleControllerServiceService {

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
     * Creates a module.
     * @param name Module Name
     * @param provider Provider of Model
     * @param desc Module Description
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createModule(name: string, provider: string, desc?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public createModule(name: string, provider: string, desc?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public createModule(name: string, provider: string, desc?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public createModule(name: string, provider: string, desc?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createModule.');
        }
        if (provider === null || provider === undefined) {
            throw new Error('Required parameter provider was null or undefined when calling createModule.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (desc !== undefined && desc !== null) {
            queryParameters = queryParameters.set('desc', <any>desc);
        }
        if (provider !== undefined && provider !== null) {
            queryParameters = queryParameters.set('provider', <any>provider);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.post<any>(`${this.configuration.basePath}/api/module`,
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
     * Set module\&#39;s \&#39;status\&#39; to 0.
     * @param uid Module ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteModuleByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteModuleByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteModuleByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteModuleByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling deleteModuleByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.delete<any>(`${this.configuration.basePath}/api/module/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Filter list of modules
     * Returns list of filtered modules
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param keyword Keyword for filter
     * @param fromdate From Date for filter
     * @param todate To date for filter
     * @param status status for filter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public filterModules(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public filterModules(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public filterModules(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public filterModules(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/filter/module`,
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
     * Retrieves module by Uid.
     * @param uid Module_ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getModuleByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getModuleByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getModuleByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getModuleByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling getModuleByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/module/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get list of modules
     * Returns list of modules
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getModules(page_number?: number, page_size?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getModules(page_number?: number, page_size?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getModules(page_number?: number, page_size?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getModules(page_number?: number, page_size?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/module`,
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
     * Update module by Uid.
     * @param uid Module_ID, NOT \&#39;ID\&#39;.
     * @param name Modulename
     * @param provider Provider of Model
     * @param desc Module Description
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateModuleByUid(uid: string, name: string, provider: string, desc?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateModuleByUid(uid: string, name: string, provider: string, desc?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateModuleByUid(uid: string, name: string, provider: string, desc?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateModuleByUid(uid: string, name: string, provider: string, desc?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling updateModuleByUid.');
        }
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling updateModuleByUid.');
        }
        if (provider === null || provider === undefined) {
            throw new Error('Required parameter provider was null or undefined when calling updateModuleByUid.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (desc !== undefined && desc !== null) {
            queryParameters = queryParameters.set('desc', <any>desc);
        }
        if (provider !== undefined && provider !== null) {
            queryParameters = queryParameters.set('provider', <any>provider);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.put<any>(`${this.configuration.basePath}/api/module/${encodeURIComponent(String(uid))}`,
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

}
