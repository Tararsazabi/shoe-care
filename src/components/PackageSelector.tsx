import React from 'react';
import { ServicePackage } from '../types';
import { formatRupiah } from '../utils/format';
import { Check } from 'lucide-react';

interface PackageSelectorProps {
  packages: ServicePackage[];
  selectedId: string;
  onSelect: (id: 'basic-clean' | 'deep-clean') => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  packages,
  selectedId,
  onSelect,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="block text-sm font-semibold text-neutral-900">
          1. Pilih Paket Layanan Utama
        </label>
        <span className="text-xs text-neutral-500">Pilih salah satu</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const isSelected = selectedId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              id={`package-card-${pkg.id}`}
              onClick={() => onSelect(pkg.id as 'basic-clean' | 'deep-clean')}
              className={`text-left p-5 rounded-lg transition-all cursor-pointer relative bg-white min-h-[140px] flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-neutral-900 shadow-sm'
                  : 'border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{pkg.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{pkg.turnaroundTime}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white'
                        : 'border border-neutral-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                    {formatRupiah(pkg.price)}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1">/ pasang</span>
                </div>

                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-700 mb-1.5">Termasuk pengerjaan:</p>
                <ul className="space-y-1">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
