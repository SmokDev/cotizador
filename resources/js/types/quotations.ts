import { Client } from "./client";

export interface QuotationContact {
	name: string;
	phone: string;
	email: string;
	address: string;
	signature?: string;
}

export enum QuotationType {
	Multiple = "multiple",
	Single = "single",
}

export interface QuotationBase{
	type: QuotationType;
	client: Client;
	number: number;
	date: Date;
	expirationDate: Date;
	notes: string;
	contact: QuotationContact;
	paymentTerms: string;
	deliveryLabel: string;
	daysDelivery: number;
	template: QuotationTemplate;
}

export interface QuotationMultiple extends QuotationBase{
	type: QuotationType.Multiple;
	title?: string;
	body: ItemSinglePrice[]
	result: Result;
}

export interface QuotationSingle extends QuotationBase{
	type: QuotationType.Single;
	body: ItemMultiplePrice
}

export type Quotation = QuotationMultiple | QuotationSingle;

export interface Price {
	quantity: number;
	unitPrice: number;
	discount: number;
	result: Result;
}

export interface ItemSinglePrice {
	name: string;
	description: string;
	price: Price;
}

export interface ItemMultiplePrice {
	name: string;
	description: string;
	prices: Price[];
}
export interface QuotationTemplate {
	logo: string;
	background: string;
    colors: {
        text: string;
        background: string;
        primary: string;
        primaryForeground: string;
    }
	footerMessage: string;
}

export interface Result {
    subtotal: number;
    subtotalWithoutDiscount: number;
    discount: number;
    iva: number;
    total: number;
}
