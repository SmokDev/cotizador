import { Client } from "./client";
import Result from "./priceResult";

export interface QuotationContact {
	name: string;
	phone: string;
	email: string;
	address: string;
	signature: string;
}

export interface QuotationInterface<T extends  "multiple" | "single">{
	type: T;
	title?: T extends "multiple" ? string | undefined : null;
	client: Client;
	number: number;
	date: Date;
	expirationDate: Date;
	items: T extends "multiple" ? ItemSinglePrice[] : [Item];
	notes: string;
	contact: QuotationContact;
	footerMessage: string;
	paymentTerms: string;
	deliveryLabel: string;
	daysDelivery: number;
	result: T extends "multiple" ? Result : null;
}

export type Quotation = QuotationInterface<"multiple"> | QuotationInterface<"single">;

export interface Price {
	quantity: number;
	unitPrice: number | {
		items: string[];
		prices: number[];
	};
	discount: number;
	result: Result;
}


export interface Item {
	name: string;
	description: string;
	prices: Price[];
}

export interface ItemSinglePrice extends  Item {
	prices: [Price];
}
