import { useState } from 'react';
import type { Order } from '../../types';

type OrderStatus = Order['status'];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-yellow/20 text-yellow-800' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
  shipped:   { label: 'Enviado',    className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado',  className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado',  className: 'bg-red-100 text-red-700' },
};

interface MockOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

const MOCK_ORDERS: MockOrder[] = [
  { id: '#1024', customer: 'María García',     date: '28 may 2026', total: 89900,  status: 'confirmed', items: 2 },
  { id: '#1023', customer: 'Laura Torres',     date: '27 may 2026', total: 45000,  status: 'shipped',   items: 1 },
  { id: '#1022', customer: 'Valentina Ruiz',   date: '26 may 2026', total: 130000, status: 'delivered', items: 3 },
  { id: '#1021', customer: 'Sofía López',      date: '25 may 2026', total: 67500,  status: 'pending',   items: 1 },
  { id: '#1020', customer: 'Camila Martínez',  date: '24 may 2026', total: 159000, status: 'delivered', items: 4 },
  { id: '#1019', customer: 'Isabella Herrera', date: '23 may 2026', total: 89900,  status: 'cancelled', items: 2 },
  { id: '#1018', customer: 'Daniela Castro',   date: '22 may 2026', total: 45000,  status: 'delivered', items: 1 },
];

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function AdminOrders() {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = filter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === filter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading text-navy mb-1">Pedidos</h1>
        <p className="text-sm text-gray-500 font-body">{MOCK_ORDERS.length} pedidos este mes</p>
      </div>

      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
            filter === 'all'
              ? 'bg-navy text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-navy'
          }`}
        >
          Todos
        </button>
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
              filter === s
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-navy'
            }`}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Productos</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(order => {
              const s = STATUS_CONFIG[order.status];
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{order.id}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-gray-500">{order.items} art.</td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    ${order.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.className}`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 font-body">
            No hay pedidos con ese estado.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
