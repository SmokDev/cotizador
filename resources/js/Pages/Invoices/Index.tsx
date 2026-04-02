import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Si prefieres usar la interfaz de types/invoice.ts en lugar de `any`, puedes importarla.
interface Props {
  invoices: any[];
}

export default function Index({ invoices }: Props) {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <Head title="Cotizaciones" />
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cotizaciones</h1>
          <p className="text-gray-500 mt-1">Gestión del historial de facturas y cotizaciones.</p>
        </div>
        <Link 
          href="/invoices/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all active:scale-95"
        >
          + Nueva Cotización
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider">N°</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider">Título</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider">Cliente</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider">Vencimiento</th>
                <th className="py-4 px-6 font-semibold text-sm text-gray-600 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-800">No hay cotizaciones registradas</p>
                    <p className="text-sm mt-1">Comienza creando una nueva cotización en el sistema.</p>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6 text-gray-900 font-medium">#{invoice.number}</td>
                    <td className="py-4 px-6 text-gray-800">{invoice.title}</td>
                    
                    {/* Hacemos Eager Loading en Laravel de 'client', así que existe invoice.client */}
                    <td className="py-4 px-6 text-gray-600">{invoice.client?.name || 'N/A'}</td>
                    
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {/* En JS, Laravel manda las propiedades de Modelos en snake_case por defecto */}
                      {new Date(invoice.expiration_date).toLocaleDateString()}
                    </td>
                    
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/invoices/${invoice.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
