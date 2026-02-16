import { Client } from "./client";

export interface Quotation {
	client: Client;
	number: number;
	date: Date;
	expirationDate: Date;
	notes: string;
	contact: {
			name: string;
			phone: string;
			email: string;
			address: string;
			signature: string;
	};
	footerMessage: string;
	paymentTerms: string;
	deliveryLabel: string;
	daysDelivery: number;
}

export interface QuotationMultipleItems extends Quotation {
    title: string;
	items: ItemMultiplePrices[];
}


export interface QuotationSingleItem extends Quotation, ItemSinglePrice {}

export interface Price {
	quantity: number;
	unitPrice: number | {
		items: string[];
		prices: number[];
	};
	discount: number;
}


export interface Item {
	name: string;
	description: string;
}

export interface ItemMultiplePrices extends Item {
	prices: Price[];
}

export interface ItemSinglePrice extends  Item, Price {}
