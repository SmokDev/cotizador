import type { Item, Result, UnitPrice } from "../types/invoice";

export function calculatorUnitPrice(unitPrice: UnitPrice): number {
	if (typeof unitPrice === "object") {
		const {spents, utility} = unitPrice;
		const totalSpents = spents.reduce((acc, spent) => acc + spent.quantity, 0);
		return totalSpents * (1 + ( utility / 100));
	}
	return unitPrice;
}

export function calculatorUnitPricePerUnit(unitPrice: UnitPrice, quantity: number): number {
	if (typeof unitPrice === "object") {
		const total = calculatorUnitPrice(unitPrice);
		return quantity > 0 ? total / quantity : total;
	}
	return unitPrice;
}

export function calculatorPrice(quantity: number, unitPrice: UnitPrice, percentDiscount: number, iva: number = 0.16): Result {
	const unitPriceResult = calculatorUnitPricePerUnit(unitPrice, quantity);
	const discountItem = (percentDiscount / 100) * unitPriceResult;
	const discount = discountItem * quantity;
	const subtotalWithoutDiscount = unitPriceResult * quantity;
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
	}, {
		discount: 0,
		subtotalWithoutDiscount: 0,
		subtotal: 0,
		iva: 0,
		total: 0,
	})
}