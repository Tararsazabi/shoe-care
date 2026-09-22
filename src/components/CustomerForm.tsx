import React from 'react';
import { CustomerForm as CustomerFormType } from '../types';

interface CustomerFormProps {
  formData: CustomerFormType;
  errors: {
    name?: string;
    phoneNumber?: string;
  };
  onChange: (field: keyof CustomerFormType, value: string) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <label className="block text-sm font-semibold text-neutral-900">
          3. Informasi Kontak Pelanggan
        </label>
        <span className="text-xs text-neutral-500">Wajib diisi</span>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        <div>
          <label htmlFor="customer-name" className="block text-xs font-semibold text-neutral-800 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="customer-name"
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className={`w-full h-11 px-3.5 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
              errors.name ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
            }`}
          />
          {errors.name ? (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
          ) : (
            <p className="text-xs text-neutral-500 mt-1">Gunakan nama yang mudah dikenali saat pengantaran.</p>
          )}
        </div>

        <div>
          <label htmlFor="customer-phone" className="block text-xs font-semibold text-neutral-800 mb-1.5">
            Nomor WhatsApp Aktif
          </label>
          <input
            id="customer-phone"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            placeholder="Contoh: 081234567890"
            className={`w-full h-11 px-3.5 rounded-lg border text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
            }`}
          />
          {errors.phoneNumber ? (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.phoneNumber}</p>
          ) : (
            <p className="text-xs text-neutral-500 mt-1">Format: 08xx atau 628xx (minimal 10 digit angka).</p>
          )}
        </div>
      </div>
    </section>
  );
};
