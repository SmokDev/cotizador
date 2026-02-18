import type { Price } from "../types/quotations";
import type Result from "../types/priceResult";

export function calculatorPrice(price: Price, iva: number = 0.16): Result {
    let unitPrice: number = 0;
    if (typeof price.unitPrice === "object") {
        price.unitPrice.prices.forEach((price) => {
            unitPrice += price
        });
    } else {
        unitPrice = price.unitPrice;
    }
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
