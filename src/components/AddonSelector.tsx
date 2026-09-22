import React from 'react';
import { ServiceAddon } from '../types';
import { formatRupiah } from '../utils/format';
import { Check } from 'lucide-react';

interface AddonSelectorProps {
  addons: ServiceAddon[];
  selectedAddonIds: string[];
  onToggleAddon: (id: string) => void;
}

export const AddonSelector: React.FC<AddonSelectorProps> = ({
  addons,
  selectedAddonIds,
  onToggleAddon,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="block text-sm font-semibold text-neutral-900">
          2. Layanan Tambahan (Opsional)
        </label>
        <span className="text-xs text-neutral-500">Pilihan bebas</span>
      </div>

      <div className="space-y-3">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <button
              key={addon.id}
              type="button"
              id={`addon-card-${addon.id}`}
              onClick={() => onToggleAddon(addon.id)}
              className={`w-full text-left p-4 rounded-lg transition-all cursor-pointer bg-white flex items-center justify-between gap-4 ${
                isSelected
                  ? 'border-2 border-neutral-900 shadow-sm'
                  : 'border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white'
                      : 'border border-neutral-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900">{addon.name}</h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-lg">
                      {addon.turnaroundTime}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">{addon.description}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-neutral-900">
                  +{formatRupiah(addon.price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
