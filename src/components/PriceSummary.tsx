import React from 'react';
import { ServicePackage, ServiceAddon } from '../types';
import { formatRupiah } from '../utils/format';
import { MessageCircle, Loader2 } from 'lucide-react';

interface PriceSummaryProps {
  selectedPackage: ServicePackage | undefined;
  selectedAddons: ServiceAddon[];
  totalPrice: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  selectedPackage,
  selectedAddons,
  totalPrice,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
          Ringkasan Estimasi Biaya
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center text-neutral-700">
          <span>{selectedPackage?.name || 'Paket Layanan'}</span>
          <span className="font-medium text-neutral-900">
            {selectedPackage ? formatRupiah(selectedPackage.price) : 'Rp0'}
          </span>
        </div>

        {selectedAddons.length > 0 ? (
          selectedAddons.map((addon) => (
            <div key={addon.id} className="flex justify-between items-center text-neutral-700">
              <span className="text-xs text-neutral-600">+ {addon.name}</span>
              <span className="font-medium text-neutral-900 text-xs">
                {formatRupiah(addon.price)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex justify-between items-center text-neutral-400 text-xs">
            <span>Layanan Tambahan</span>
            <span>Rp0</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-200 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block">
            Total Estimasi
          </span>
          <span className="text-xs text-neutral-400">Termasuk pajak &amp; kemasan</span>
        </div>
        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {formatRupiah(totalPrice)}
          </span>
        </div>
      </div>

      <button
        id="send-whatsapp-order-btn"
        type="button"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memproses Pesanan...</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Send Order to WhatsApp</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-neutral-500 leading-normal">
        Data pesanan tersimpan di database dan chat WhatsApp akan langsung terbuka otomatis.
      </p>
    </div>
  );
};
