import React from 'react';
import { formatRupiah } from '../utils/format';
import { CheckCircle2, ExternalLink, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappUrl: string;
  customerName: string;
  customerPhone: string;
  selectedItems: string;
  totalPrice: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  whatsappUrl,
  customerName,
  customerPhone,
  selectedItems,
  totalPrice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-grayscale-0">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Pesanan Berhasil Dicatat</h3>
            <p className="text-xs text-neutral-500">Status pesanan: Menunggu konfirmasi (Pending)</p>
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2 text-xs text-neutral-700 mb-5">
          <div className="flex justify-between">
            <span className="text-neutral-500">Pelanggan:</span>
            <span className="font-semibold text-neutral-900">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">No. WhatsApp:</span>
            <span className="font-medium text-neutral-900">{customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Layanan:</span>
            <span className="font-medium text-neutral-900 text-right">{selectedItems}</span>
          </div>
          <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
            <span className="text-neutral-500 font-medium">Total Biaya:</span>
            <span className="text-sm font-bold text-neutral-900">{formatRupiah(totalPrice)}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            id="fallback-whatsapp-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Buka WhatsApp Sekarang</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Kembali ke Kalkulator
          </button>
        </div>

        <p className="text-[11px] text-center text-neutral-400 mt-3">
          Jika WhatsApp tidak terbuka otomatis, klik tombol hijau di atas.
        </p>
      </div>
    </div>
  );
};
