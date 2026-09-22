import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-200 bg-white py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-600">
              Layanan Cuci &amp; Restorasi Sneaker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Kalkulator Estimasi Biaya
          </h1>
          <p className="mt-1 text-sm sm:text-base text-neutral-600">
            Pilih paket perawatan sepatu Anda, lengkapi data, dan kirimkan pesanan langsung ke WhatsApp.
          </p>
        </div>
        <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
          <div className="text-xs text-neutral-500">Nomor WhatsApp Resmi</div>
          <div className="text-sm font-semibold text-neutral-900">+62 895-4146-26400</div>
        </div>
      </div>
    </header>
  );
};
