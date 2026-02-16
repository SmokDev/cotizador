import React from 'react';
import { Link, Head } from '@inertiajs/react';

declare var route: any;

interface Props {
    quotations: any[]; // Using any for simplicity as per requirement
}

export default function Index({ quotations }: Props) {
    return (
        <div className="p-6">
            <Head title="Quotations" />
            <h1 className="text-2xl font-bold mb-4">Quotations List</h1>
            <div className="mb-4">
                <Link 
                    href={route('quotations.create')} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create New Quotation
                </Link>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Quotation #</th>
                            <th className="py-2 px-4 border-b text-left">Client</th>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">Expiration</th>
                            <th className="py-2 px-4 border-b text-left">Total</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.map((quotation) => (
                            <tr key={quotation.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{quotation.number}</td>
                                <td className="py-2 px-4 border-b">{quotation.client?.name || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{quotation.date}</td>
                                <td className="py-2 px-4 border-b">{quotation.expiration_date}</td>
                                <td className="py-2 px-4 border-b font-medium">
                                    ${Number(quotation.total).toFixed(2)}
                                </td>
                                <td className="py-2 px-4 border-b flex gap-2">
                                    <Link 
                                        href={route('quotations.show', quotation.id)} 
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        View
                                    </Link>
                                    <Link 
                                        href={route('quotations.edit', quotation.id)} 
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {quotations.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                                    No quotations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
