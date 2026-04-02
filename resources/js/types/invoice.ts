import { Client } from "./client";

export interface InvoiceContact {
	name: string;
	phone: string;
	email: string;
	signature?: string;
}


export interface Invoice{
	title: string;
	description: string;
	client: Client;
	number: number;
	date: Date;
	items: Item[];
	expirationDate: Date;
	notes: string;
	contact: InvoiceContact;
	paymentTerms: string;
	deliveryLabel: string;
	daysDelivery: number;
}

export interface Item {
	description: string;
	quantity: number;
	unitPrice: UnitPrice;
	percentDiscount: number;
}

export type UnitPrice = number | {
	spents: {
		name: string;
		quantity: number;
	}[];
	utility: number;
}

export interface InvoiceTemplate {
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
