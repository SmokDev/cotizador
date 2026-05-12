import { formatCurrency, formatDate } from "../utils/helpers";
import { calculatorPrice, calculatorTotal } from "../utils/calculator";

interface Item {
    description: string;
    quantity: number;
    unit_price: any;
    percent_discount: number;
}

interface Contact {
    name: string;
    email: string;
    phone: string;
}

interface Props {
    title: string;
    number: string;
    date: string;
    expiration_date: string;
    description: string;
    items: Item[];
    notes: string;
    contact: Contact;
    payment_terms: string;
    delivery_label: string;
    days_delivery: number;
    client_name?: string;
    client_company?: string;
}

export default function QuotationPreview({
    title, number, date, expiration_date, description,
    items, notes, contact, payment_terms, delivery_label, days_delivery,
    client_name, client_company,
}: Props) {
    const results = items.map(item =>
        calculatorPrice(item.quantity, item.unit_price, item.percent_discount)
    );
    const totals = calculatorTotal(results);

    const unitPriceValue = (unit_price: any, quantity: number): number => {
        if (typeof unit_price === "object" && unit_price !== null) {
            const spents = unit_price.spents || [];
            const totalSpents = spents.reduce((acc: number, s: any) => acc + (Number(s.quantity) || 0), 0);
            const total = totalSpents * (1 + ((unit_price.utility || 0) / 100));
            return quantity > 0 ? total / quantity : total;
        }
        return Number(unit_price) || 0;
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ fontFamily: "'Instrument Sans', Arial, sans-serif" }}>
            <div className="p-8 flex flex-col gap-5 min-h-[800px]">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-amber-700">COTIZACIÓN</h1>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p><span className="font-semibold text-gray-800">No. de Cotización:</span> {number}</p>
                        <p><span className="font-semibold text-gray-800">Fecha:</span> {formatDate(new Date(date))}</p>
                        {date !== expiration_date && (
                            <p><span className="font-semibold text-gray-800">Vigencia:</span> {formatDate(new Date(expiration_date))}</p>
                        )}
                    </div>
                </div>

                {client_name && (
                    <div>
                        <h2 className="text-lg font-bold text-amber-700">{client_name}</h2>
                        {client_company && <p className="text-sm text-gray-600">{client_company}</p>}
                    </div>
                )}

                {title && (
                    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                )}

                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}

                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-amber-700 text-white">
                            <th className="text-left py-2 px-3 rounded-l-lg w-[35%]">Nombre</th>
                            <th className="text-left py-2 px-3 w-[25%]">Descripción</th>
                            <th className="text-center py-2 px-3 w-[12%]">Cant.</th>
                            <th className="text-center py-2 px-3 w-[13%]">P/U</th>
                            <th className="text-center py-2 px-3 w-[10%]">Desc.</th>
                            <th className="text-right py-2 px-3 rounded-r-lg w-[15%]">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} className="border-b border-amber-100">
                                <td className="py-2 px-3 text-gray-800">{item.description || "-"}</td>
                                <td className="py-2 px-3 text-gray-500"></td>
                                <td className="py-2 px-3 text-center">{item.quantity}</td>
                                <td className="py-2 px-3 text-center">${formatCurrency(unitPriceValue(item.unit_price, item.quantity))}</td>
                                <td className="py-2 px-3 text-center">{item.percent_discount ? `${item.percent_discount}%` : "-"}</td>
                                <td className="py-2 px-3 text-right font-medium">
                                    ${formatCurrency(calculatorPrice(item.quantity, item.unit_price, item.percent_discount).subtotalWithoutDiscount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between gap-6 mt-auto">
                    <div className="w-3/5 text-xs text-gray-600">
                        <h3 className="font-bold text-amber-700 text-sm mb-2">Términos y condiciones</h3>
                        {days_delivery && (
                            <p><span className="font-semibold">Tiempo de entrega:</span>{" "}
                                {isNaN(Number(days_delivery))
                                    ? days_delivery
                                    : `${days_delivery} días hábiles a partir de su aprobación`}
                            </p>
                        )}
                        <p><span className="font-semibold">Forma de pago:</span> {payment_terms}</p>
                        {notes && (
                            <>
                                <p className="font-semibold mt-2">Notas:</p>
                                {notes.split("\n").map((line, i) => (
                                    <p key={i} className="ml-3">{line || "\u00A0"}</p>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="w-2/5 bg-amber-700 text-white rounded-lg p-4 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${formatCurrency(totals.subtotalWithoutDiscount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Descuento:</span>
                            <span>${formatCurrency(totals.discount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>IVA (16%):</span>
                            <span>${formatCurrency(totals.iva)}</span>
                        </div>
                        <hr className="my-2 border-amber-400" />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total:</span>
                            <span>${formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 border-t border-amber-700 pt-4 mt-auto">
                    {contact.name && (
                        <p className="text-gray-600">{contact.name} {contact.phone && `| ${contact.phone}`} {contact.email && `| ${contact.email}`}</p>
                    )}
                    <p className="text-gray-400 mt-1">Gracias por su preferencia</p>
                </div>
            </div>
        </div>
    );
}