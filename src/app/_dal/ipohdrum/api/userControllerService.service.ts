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
export class UserControllerServiceService {

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
     * Authenticates current request\&#39;s user.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public authenticateCurrentRequestsUser(observe?: 'body', reportProgress?: boolean): Observable<any>;
    public authenticateCurrentRequestsUser(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public authenticateCurrentRequestsUser(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public authenticateCurrentRequestsUser(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.post<any>(`${this.configuration.basePath}/api/authentication`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Creates a user.
     * @param name Username
     * @param email Email
     * @param password Password
     * @param password_confirmation Password Confirmation
     * @param country Country
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createUser(name: string, email: string, password: string, password_confirmation: string, country?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public createUser(name: string, email: string, password: string, password_confirmation: string, country?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public createUser(name: string, email: string, password: string, password_confirmation: string, country?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public createUser(name: string, email: string, password: string, password_confirmation: string, country?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createUser.');
        }
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling createUser.');
        }
        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling createUser.');
        }
        if (password_confirmation === null || password_confirmation === undefined) {
            throw new Error('Required parameter password_confirmation was null or undefined when calling createUser.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (email !== undefined && email !== null) {
            queryParameters = queryParameters.set('email', <any>email);
        }
        if (password !== undefined && password !== null) {
            queryParameters = queryParameters.set('password', <any>password);
        }
        if (password_confirmation !== undefined && password_confirmation !== null) {
            queryParameters = queryParameters.set('password_confirmation', <any>password_confirmation);
        }
        if (country !== undefined && country !== null) {
            queryParameters = queryParameters.set('country', <any>country);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.post<any>(`${this.configuration.basePath}/api/user`,
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
     * Creates a user without needing authorization.
     * @param name Username.
     * @param email Email.
     * @param password Password.
     * @param password_confirmation Confirm Password.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createUserWithoutAuthorization(name: string, email: string, password: string, password_confirmation: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public createUserWithoutAuthorization(name: string, email: string, password: string, password_confirmation: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public createUserWithoutAuthorization(name: string, email: string, password: string, password_confirmation: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public createUserWithoutAuthorization(name: string, email: string, password: string, password_confirmation: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createUserWithoutAuthorization.');
        }
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling createUserWithoutAuthorization.');
        }
        if (password === null || password === undefined) {
            throw new Error('Required parameter password was null or undefined when calling createUserWithoutAuthorization.');
        }
        if (password_confirmation === null || password_confirmation === undefined) {
            throw new Error('Required parameter password_confirmation was null or undefined when calling createUserWithoutAuthorization.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (email !== undefined && email !== null) {
            queryParameters = queryParameters.set('email', <any>email);
        }
        if (password !== undefined && password !== null) {
            queryParameters = queryParameters.set('password', <any>password);
        }
        if (password_confirmation !== undefined && password_confirmation !== null) {
            queryParameters = queryParameters.set('password_confirmation', <any>password_confirmation);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.post<any>(`${this.configuration.basePath}/api/register`,
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
     * Set user\&#39;s \&#39;status\&#39; to 0.
     * @param uid User ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteUserByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public deleteUserByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public deleteUserByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public deleteUserByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling deleteUserByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.delete<any>(`${this.configuration.basePath}/api/user/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Filter list of users
     * Returns list of filtered users
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param keyword Keyword for filter
     * @param fromdate From Date for filter
     * @param todate To string for filter
     * @param status status for filter
     * @param company_id Company id for filter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public filterUsers(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, company_id?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public filterUsers(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, company_id?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public filterUsers(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, company_id?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public filterUsers(page_number?: number, page_size?: number, keyword?: string, fromdate?: string, todate?: string, status?: string, company_id?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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
        if (company_id !== undefined && company_id !== null) {
            queryParameters = queryParameters.set('company_id', <any>company_id);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/filter/user`,
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
     * Retrieves user by Uid.
     * @param uid User_ID, NOT \&#39;ID\&#39;.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUserByUid(uid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getUserByUid(uid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getUserByUid(uid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getUserByUid(uid: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling getUserByUid.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/user/${encodeURIComponent(String(uid))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get list of users
     * Returns list of users
     * @param page_number Page number
     * @param page_size number of pageSize
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUsers(page_number?: number, page_size?: number, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public getUsers(page_number?: number, page_size?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public getUsers(page_number?: number, page_size?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public getUsers(page_number?: number, page_size?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

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


        return this.httpClient.get<any>(`${this.configuration.basePath}/api/user`,
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
     * Update user by Uid.
     * @param uid User_ID, NOT \&#39;ID\&#39;.
     * @param name Username.
     * @param email Email.
     * @param country Country.
     * @param tel1 Telephone Number #1.
     * @param address1 Address #1.
     * @param city City.
     * @param postcode PostCode.
     * @param state State.
     * @param icno IC Number.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateUserByUid(uid: string, name: string, email: string, country: string, tel1?: string, address1?: string, city?: string, postcode?: string, state?: string, icno?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public updateUserByUid(uid: string, name: string, email: string, country: string, tel1?: string, address1?: string, city?: string, postcode?: string, state?: string, icno?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public updateUserByUid(uid: string, name: string, email: string, country: string, tel1?: string, address1?: string, city?: string, postcode?: string, state?: string, icno?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public updateUserByUid(uid: string, name: string, email: string, country: string, tel1?: string, address1?: string, city?: string, postcode?: string, state?: string, icno?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (uid === null || uid === undefined) {
            throw new Error('Required parameter uid was null or undefined when calling updateUserByUid.');
        }
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling updateUserByUid.');
        }
        if (email === null || email === undefined) {
            throw new Error('Required parameter email was null or undefined when calling updateUserByUid.');
        }
        if (country === null || country === undefined) {
            throw new Error('Required parameter country was null or undefined when calling updateUserByUid.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', <any>name);
        }
        if (email !== undefined && email !== null) {
            queryParameters = queryParameters.set('email', <any>email);
        }
        if (tel1 !== undefined && tel1 !== null) {
            queryParameters = queryParameters.set('tel1', <any>tel1);
        }
        if (address1 !== undefined && address1 !== null) {
            queryParameters = queryParameters.set('address1', <any>address1);
        }
        if (city !== undefined && city !== null) {
            queryParameters = queryParameters.set('city', <any>city);
        }
        if (postcode !== undefined && postcode !== null) {
            queryParameters = queryParameters.set('postcode', <any>postcode);
        }
        if (state !== undefined && state !== null) {
            queryParameters = queryParameters.set('state', <any>state);
        }
        if (country !== undefined && country !== null) {
            queryParameters = queryParameters.set('country', <any>country);
        }
        if (icno !== undefined && icno !== null) {
            queryParameters = queryParameters.set('icno', <any>icno);
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        return this.httpClient.put<any>(`${this.configuration.basePath}/api/user/${encodeURIComponent(String(uid))}`,
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
