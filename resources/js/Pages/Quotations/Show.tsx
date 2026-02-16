import React from 'react';
import { Link, Head, router } from '@inertiajs/react';

declare var route: any;

interface Props {
    quotation: any;
}

export default function Show({ quotation }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            router.delete(route('quotations.destroy', quotation.id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
            <Head title={`Quotation #${quotation.number}`} />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quotation #{quotation.number}</h1>
                <div className="space-x-2">
                    <Link
                        href={route('quotations.index')}
                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                    >
                        Back
                    </Link>
                    <Link
                        href={route('quotations.edit', quotation.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                   <h2 className="text-lg font-semibold text-gray-700">Client Details</h2>
                   <p className="text-gray-600 mt-1">
                       <span className="font-medium">Name:</span> {quotation.client?.name}
                   </p>
                   {quotation.client?.empresa && (
                       <p className="text-gray-600">
                           <span className="font-medium">Company:</span> {quotation.client.empresa}
                       </p>
                   )}
                    {quotation.client?.email && (
                       <p className="text-gray-600">
                           <span className="font-medium">Email:</span> {quotation.client.email}
                       </p>
                   )}
                </div>
                <div className="text-right">
                    <h2 className="text-lg font-semibold text-gray-700">Quotation Details</h2>
                    <p className="text-gray-600 mt-1">
                        <span className="font-medium">Date:</span> {quotation.date}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Expires:</span> {quotation.expiration_date}
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Items</h3>
            <table className="min-w-full bg-white border border-gray-200 mb-6">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-4 text-left">Description</th>
                        <th className="py-2 px-4 text-center">Qty</th>
                        <th className="py-2 px-4 text-right">Unit Price</th>
                        <th className="py-2 px-4 text-right">Discount</th>
                        <th className="py-2 px-4 text-right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {quotation.items.map((item: any) => {
                         // Simple price check logic matching backend
                         let unitCost = 0;
                         if (typeof item.unit_price === 'number') {
                             unitCost = item.unit_price;
                         } else if (typeof item.unit_price === 'string' && !isNaN(Number(item.unit_price))) {
                             unitCost = Number(item.unit_price);
                         } else if (item.unit_price?.prices) {
                             // Approximation for UI if structure
                             unitCost = item.unit_price.prices.reduce((a:number, b:number) => a + b, 0);
                         }
                         
                         const subtotal = (unitCost * item.quantity) - item.discount;

                         return (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 px-4">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">{item.description}</div>
                                </td>
                                <td className="py-2 px-4 text-center">{item.quantity}</td>
                                <td className="py-2 px-4 text-right">${unitCost.toFixed(2)}</td>
                                <td className="py-2 px-4 text-right">${Number(item.discount).toFixed(2)}</td>
                                <td className="py-2 px-4 text-right font-medium">${subtotal.toFixed(2)}</td>
                            </tr>
                         );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="py-3 px-4 text-right font-bold text-lg">Total:</td>
                        <td className="py-3 px-4 text-right font-bold text-lg text-indigo-600">
                            ${Number(quotation.total).toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {(quotation.notes || quotation.payment_terms) && (
                <div className="grid grid-cols-2 gap-6 border-t pt-4">
                    {quotation.payment_terms && (
                        <div>
                            <h4 className="font-semibold text-gray-700">Payment Terms</h4>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{quotation.payment_terms}</p>
                        </div>
                    )}
                     {quotation.notes && (
                        <div>
                            <h4 className="font-semibold text-gray-700">Notes</h4>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{quotation.notes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
