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


export interface SaleItem { 
    id?: number;
    sale_id?: number;
    inventory_id?: number;
    inventory_family_id?: number;
    pattern_id?: number;
    ticket_id?: number;
    uid?: string;
    name?: string;
    trackingcode?: string;
    qty?: number;
    desc?: string;
    cost?: number;
    price?: number;
    disc?: number;
    totalprice?: number;
    totalcost?: number;
    grandtotal?: number;
    status?: string;
    type?: string;
    created_at?: string;
    updated_at?: string;
}

