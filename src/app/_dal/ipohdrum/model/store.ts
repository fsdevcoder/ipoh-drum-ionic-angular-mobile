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
import { Company } from './company';


export interface Store { 
    id?: number;
    company_id?: number;
    company?: Company;
    user_id?: number;
    uid?: string;
    name?: string;
    contact?: string;
    desc?: string;
    imgpath?: string;
    imgpublicid?: string;
    email?: string;
    rating?: number;
    freeshippingminpurchase?: number;
    address?: string;
    state?: string;
    postcode?: string;
    city?: string;
    country?: string;
    status?: number;
    company_belongings?: number;
    created_at?: string;
    updated_at?: string;
}
