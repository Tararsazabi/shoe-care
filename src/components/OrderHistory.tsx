import React from 'react';
import { OrderRecord, HistoryStatus } from '../types';
import { formatDate, formatRupiah } from '../utils/format';
import { RotateCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface OrderHistoryProps {
  orders: OrderRecord[];
  status: HistoryStatus;
  errorMessage?: string;
  onRefresh: () => void;
  onUpdateStatus: (orderId: string, newStatus: 'pending' | 'processed') => void;
  isUpdatingId: string | null;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  status,
  errorMessage,
  onRefresh,
  onUpdateStatus,
  isUpdatingId,
}) => {
  return (
    <section className="space-y-4 pt-8 border-t border-neutral-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">
            Riwayat Pesanan Masuk
          </h2>
          <p className="text-xs text-neutral-500">
            Daftar pesanan tercatat dari pelanggan dan status pengerjaan admin.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* 1. Loading State */}
      {status === 'loading' && (
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="h-4 bg-neutral-200 rounded-lg w-1/4 animate-pulse"></div>
          <div className="space-y-2.5 pt-2">
            <div className="h-10 bg-neutral-100 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-neutral-100 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-neutral-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      )}

      {/* 2. Error State */}
      {status === 'error' && (
        <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-6 text-center space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Gagal Memuat Riwayat Pesanan</h3>
            <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
              {errorMessage || 'Terjadi gangguan jaringan saat menghubungi database. Silakan coba kembali.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {status !== 'loading' && status !== 'error' && orders.length === 0 && (
        <div className="border border-dashed border-neutral-300 bg-white rounded-lg p-8 text-center space-y-2">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Belum Ada Pesanan Tercatat
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Estimasi layanan yang Anda kirimkan melalui tombol WhatsApp akan otomatis tercatat pada daftar ini.
          </p>
        </div>
      )}

      {/* 4. Data State */}
      {status !== 'loading' && status !== 'error' && orders.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 text-neutral-600 border-b border-neutral-200">
                  <th className="py-3 px-4 font-semibold">Waktu Pemesanan</th>
                  <th className="py-3 px-4 font-semibold">Pelanggan</th>
                  <th className="py-3 px-4 font-semibold">Layanan &amp; Tambahan</th>
                  <th className="py-3 px-4 font-semibold">Total Biaya</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => {
                  const isPending = order.status === 'pending';
                  const isUpdating = isUpdatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{order.customer_name}</div>
                        <div className="text-[11px] text-neutral-500">{order.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700 max-w-xs">
                        {order.selected_items}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900 whitespace-nowrap">
                        {formatRupiah(Number(order.total_price))}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-800 border border-neutral-300">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Processed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isPending ? (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(order.id, 'processed')}
                            className="inline-flex items-center justify-center h-8 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating ? 'Memperbarui...' : 'Mark as Processed'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(order.id, 'pending')}
                            className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Set to Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
