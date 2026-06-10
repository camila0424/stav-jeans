import { useState, useEffect } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../../services/api';
import type { AdminOrder } from '../../services/api';

type OrderStatus = AdminOrder['status'];

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',  className: 'bg-yellow/20 text-yellow-800' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-800' },
  shipped:   { label: 'Enviado',    className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado',  className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado',  className: 'bg-red-100 text-red-700' },
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: number, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
      await updateAdminOrderStatus(id, status);
    } catch {
      // revert on failure
      getAdminOrders().then(setOrders).catch(() => {});
    }
  }

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading text-navy mb-1">Pedidos</h1>
        <p className="text-sm text-gray-500 font-body">{orders.length} pedidos registrados</p>
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
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">Cargando pedidos...</td>
              </tr>
            )}
            {!loading && filtered.map(order => {
              const s = STATUS_CONFIG[order.status];
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 text-gray-500">{order.items?.length ?? 0} art.</td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    ${order.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${s.className}`}
                    >
                      {ALL_STATUSES.map(st => (
                        <option key={st} value={st}>{STATUS_CONFIG[st].label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 font-body">
            No hay pedidos con ese estado.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
