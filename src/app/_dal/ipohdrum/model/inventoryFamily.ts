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
import { Pattern } from './pattern';


export interface InventoryFamily { 
    id?: number;
    inventory_id?: number;
    uid?: string;
    code?: string;
    sku?: string;
    name?: string;
    desc?: string;
    imgpublicid?: string;
    imgpath?: string;
    cost?: number;
    price?: number;
    qty?: number;
    salesqty?: number;
    onsale?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
    patterns?: Array<Pattern>;
}
