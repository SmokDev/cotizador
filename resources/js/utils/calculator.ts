import type { ItemMultiplePrices, ItemSinglePrice, Price } from "../types/quotations";

export function calculatorItem(item: Price): {
	discount: number;
	subtotal: number;
	total: number;
} {
    let unitPrice: number = 0;
    if (typeof item.unitPrice === "object") {
        item.unitPrice.prices.forEach((price) => {
            unitPrice += price
        });
    } else {
        unitPrice = item.unitPrice;
    }
	const discountItem = (item.discount / 100) * unitPrice;
	return {
		discount: discountItem * item.quantity,
		subtotal: unitPrice * item.quantity,
		total: (unitPrice - discountItem) * item.quantity,
	};
}

export function calculatorTotal(items: ItemSinglePrice[]): {
	subtotal: number;
	subtotalWithoutDiscount: number;
	discount: number;
	iva: number;
	total: number;
} {
	const { subtotal, subtotalWithoutDiscount } = items.reduce(
		(acc, item) => {
			const { subtotal, total } = calculatorItem(item);
			return {
				subtotal: acc.subtotal + total,
				subtotalWithoutDiscount: acc.subtotalWithoutDiscount + subtotal,
			};
		},
		{ subtotal: 0, subtotalWithoutDiscount: 0 }
	);

	const iva = subtotal * 0.16;

	return {
		subtotal,
		subtotalWithoutDiscount,
		discount: subtotalWithoutDiscount - subtotal,
		iva,
		total: subtotal + iva,
	};
}
