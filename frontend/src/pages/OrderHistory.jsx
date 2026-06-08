import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { ClipboardList, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
    accepted: { icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200', label: 'Accepted' },
    rejected: { icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Rejected' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track the status of your purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700">No orders yet</h2>
          <p className="text-slate-500">Your orders will appear here after you place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">Order #{order.id}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${cfg.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      <span className="font-medium">Shipping to:</span> {order.address}, {order.wilaya}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{item.product_name}</span>
                        <span className="text-slate-400">× {item.quantity}</span>
                      </div>
                      <span className="font-medium text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-slate-50">
                    <span className="text-slate-500">Delivery Fee ({order.wilaya})</span>
                    <span className="font-medium text-slate-900">
                      ${order.delivery_fee?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
