import type { Price, Result } from "../types/quotations";

export function calculatorPrice(price: Price, iva: number = 0.16): Result {
    let unitPrice: number = price.unitPrice;
	const discountItem = (price.discount / 100) * unitPrice;
	const discount = discountItem * price.quantity;
	const subtotalWithoutDiscount = unitPrice * price.quantity;
	const subtotal = subtotalWithoutDiscount - discount;
	const ivaResult = subtotal * iva;
	const total = subtotal + ivaResult;
	return {
		discount,
		subtotalWithoutDiscount,
		subtotal,
		iva: ivaResult,
		total,
	};
}

export function calculatorTotal(results: Result[]): Result {
	return results.reduce((acc, result) =>{
		return {
			discount: acc.discount + result.discount,
			subtotalWithoutDiscount: acc.subtotalWithoutDiscount + result.subtotalWithoutDiscount,
			subtotal: acc.subtotal + result.subtotal,
			iva: acc.iva + result.iva,
			total: acc.total + result.total,
		}
	})
}
