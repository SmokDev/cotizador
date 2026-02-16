import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

declare var route: any;

interface Props {
    clients: any[];
}

interface Item {
    name: string;
    description: string;
    quantity: number | string;
    unit_price: number | string;
    discount: number | string;
}

export default function Create({ clients }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        number: '', 
        date: new Date().toISOString().split('T')[0],
        expiration_date: '',
        notes: '',
        contact: { name: '', email: '' },
        items: [] as Item[], // Initialize empty
        payment_terms: '',
        delivery_label: '',
        days_delivery: '',
        footer_message: ''
    });

    const addItem = () => {
        setData('items', [
            ...data.items, 
            { name: '', description: '', quantity: 1, unit_price: 0, discount: 0 }
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: keyof Item, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quotations.store'));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
            <Head title="Create Quotation" />
            <h1 className="text-2xl font-bold mb-6">Create New Quotation</h1>

            <form onSubmit={submit} className="space-y-6">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Client</label>
                        <select
                            value={data.client_id}
                            onChange={e => setData('client_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            <option value="">Select a Client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name} - {client.empresa || 'No Company'}
                                </option>
                            ))}
                        </select>
                        {errors.client_id && <div className="text-red-500 text-sm mt-1">{errors.client_id}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quotation Number (ID)</label>
                        <input
                            type="number"
                            value={data.number}
                            onChange={e => setData('number', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.number && <div className="text-red-500 text-sm mt-1">{errors.number}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                        <input
                            type="date"
                            value={data.expiration_date}
                            onChange={e => setData('expiration_date', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        {errors.expiration_date && <div className="text-red-500 text-sm mt-1">{errors.expiration_date}</div>}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                        <input
                            type="text"
                            value={(data.contact as any).name || ''}
                            onChange={e => setData('contact', { ...data.contact, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                        <input
                            type="email"
                            value={(data.contact as any).email || ''}
                            onChange={e => setData('contact', { ...data.contact, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Items</h3>
                    
                    {data.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4 p-4 border rounded bg-gray-50 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500">Name</label>
                                <input
                                    placeholder="Item Name"
                                    value={item.name}
                                    onChange={e => updateItem(index, 'name', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500">Description</label>
                                <input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Qty</label>
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500">Price</label>
                                <input
                                    type="number"
                                    placeholder="unit_price"
                                    value={item.unit_price}
                                    onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500">Discount</label>
                                <input
                                    type="number"
                                    placeholder="Discount"
                                    value={item.discount}
                                    onChange={e => updateItem(index, 'discount', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                                />
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        Add Item
                    </button>
                    {errors.items && <div className="text-red-500 text-sm mt-1">{errors.items}</div>}
                </div>

                {/* Additional Details */}
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                        <textarea
                            value={data.payment_terms}
                            onChange={e => setData('payment_terms', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Link
                        href={route('quotations.index')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-4"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Create Quotation'}
                    </button>
                </div>
            </form>
        </div>
    );
}
