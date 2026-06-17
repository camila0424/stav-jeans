import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import type { DashboardStats } from '../../services/api';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
      <div className="p-3 bg-navy/10 rounded-lg text-navy">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-body">{label}</p>
        <p className="text-2xl font-semibold text-navy font-heading mt-0.5">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending:   { label: 'Pendiente',   className: 'bg-yellow/20 text-yellow-800' },
  confirmed: { label: 'Confirmado',  className: 'bg-blue/10 text-blue-800' },
  shipped:   { label: 'Enviado',     className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Entregado',   className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado',   className: 'bg-red-100 text-red-700' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number) {
  return `$${Math.round(amount).toLocaleString('es-CO')}`;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-heading text-navy mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 font-body mb-8">Resumen general</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total productos"
          value={loading ? '—' : String(stats?.total_products ?? 0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="Total pedidos"
          value={loading ? '—' : String(stats?.total_orders ?? 0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Ingresos totales"
          value={loading ? '—' : formatCurrency(stats?.total_revenue ?? 0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-navy font-body">Pedidos recientes</h2>
        </div>
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Cargando...</td>
              </tr>
            )}
            {!loading && (stats?.recent_orders ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Sin pedidos registrados.</td>
              </tr>
            )}
            {(stats?.recent_orders ?? []).map(order => {
              const s = STATUS_LABELS[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">Pedido #{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer_name}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{formatCurrency(order.total)}</td>
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
      </div>
    </div>
  );
}

export default AdminDashboard;
