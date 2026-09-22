import { useState, useEffect, useMemo, useCallback } from 'react';
import { SERVICE_PACKAGES, SERVICE_ADDONS } from './data/services';
import { CustomerForm as CustomerFormType, OrderRecord, HistoryStatus } from './types';
import {
  formatRupiah,
  sanitizePhoneNumber,
  isValidIndonesianPhone,
  buildWhatsAppUrl,
} from './utils/format';
import {
  fetchOrdersFromDb,
  insertOrderToDb,
  updateOrderStatusInDb,
  isSupabaseConfigured,
} from './lib/supabase';

import { Header } from './components/Header';
import { PackageSelector } from './components/PackageSelector';
import { AddonSelector } from './components/AddonSelector';
import { CustomerForm } from './components/CustomerForm';
import { PriceSummary } from './components/PriceSummary';
import { OrderHistory } from './components/OrderHistory';
import { ConfirmationModal } from './components/ConfirmationModal';

export default function App() {
  // Service configuration state
  const [selectedPackageId, setSelectedPackageId] = useState<'basic-clean' | 'deep-clean'>('basic-clean');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Customer form state
  const [customer, setCustomer] = useState<CustomerFormType>({
    name: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phoneNumber?: string;
  }>({});

  // Submission & modal states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    whatsappUrl: string;
    customerName: string;
    customerPhone: string;
    selectedItems: string;
    totalPrice: number;
  }>({
    isOpen: false,
    whatsappUrl: '',
    customerName: '',
    customerPhone: '',
    selectedItems: '',
    totalPrice: 0,
  });

  // Order history state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [historyStatus, setHistoryStatus] = useState<HistoryStatus>('loading');
  const [historyError, setHistoryError] = useState<string>('');
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  // Derived selected entities
  const selectedPackage = useMemo(() => {
    return SERVICE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || SERVICE_PACKAGES[0];
  }, [selectedPackageId]);

  const selectedAddons = useMemo(() => {
    return SERVICE_ADDONS.filter((addon) => selectedAddonIds.includes(addon.id));
  }, [selectedAddonIds]);

  // Pure mathematical total calculation: BasePackage + sum(Addons)
  const totalPrice = useMemo(() => {
    const base = selectedPackage ? selectedPackage.price : 0;
    const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    return base + addonsTotal;
  }, [selectedPackage, selectedAddons]);

  // Human-readable summary of selected items
  const selectedItemsSummary = useMemo(() => {
    const pkgName = selectedPackage?.name || '';
    if (selectedAddons.length === 0) return pkgName;
    const addonNames = selectedAddons.map((a) => a.name).join(', ');
    return `${pkgName} + ${addonNames}`;
  }, [selectedPackage, selectedAddons]);

  // Handlers for selection
  const handlePackageSelect = (id: 'basic-clean' | 'deep-clean') => {
    setSelectedPackageId(id);
  };

  const handleToggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCustomerChange = (field: keyof CustomerFormType, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Load orders (triggered on mount, after new order, or manual refresh)
  const loadOrders = useCallback(async () => {
    setHistoryStatus('loading');
    setHistoryError('');
    try {
      const { data, error } = await fetchOrdersFromDb();
      if (error && (!data || data.length === 0)) {
        setHistoryStatus('error');
        setHistoryError(error.message);
      } else {
        setOrders(data);
        setHistoryStatus(data.length === 0 ? 'empty' : 'ready');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil data';
      setHistoryStatus('error');
      setHistoryError(msg);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Update order status action (pending to processed)
  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'processed') => {
    setIsUpdatingId(orderId);
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      await updateOrderStatusInDb(orderId, newStatus);
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const errors: { name?: string; phoneNumber?: string } = {};

    const trimmedName = customer.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Nama lengkap wajib diisi minimal 2 karakter.';
    }

    const sanitizedPhone = sanitizePhoneNumber(customer.phoneNumber);
    if (!customer.phoneNumber.trim()) {
      errors.phoneNumber = 'Nomor WhatsApp wajib diisi.';
    } else if (!isValidIndonesianPhone(sanitizedPhone)) {
      errors.phoneNumber = 'Nomor WhatsApp tidak valid. Format: 08xx atau 628xx (10-15 digit).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Order Submission Lifecycle
  const handleSendOrder = async () => {
    if (!validateForm()) {
      // Scroll to customer info if invalid
      const formEl = document.getElementById('customer-name');
      formEl?.focus();
      return;
    }

    setIsSubmitting(true);

    const sanitizedPhone = sanitizePhoneNumber(customer.phoneNumber);
    const expressAddon = selectedAddons.find((a) => a.id === 'express-delivery');

    // Step A: Insert record into Supabase orders table (or resilient fallback)
    try {
      await insertOrderToDb({
        customer_name: customer.name.trim(),
        customer_phone: sanitizedPhone,
        selected_items: selectedItemsSummary,
        total_price: totalPrice,
      });
    } catch (insertErr) {
      console.warn('Database logging warning, continuing to WhatsApp:', insertErr);
    }

    // Step B: Construct WhatsApp deep link
    const waUrl = buildWhatsAppUrl({
      customerName: customer.name,
      customerPhone: customer.phoneNumber,
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price,
      addonName: expressAddon?.name,
      addonPrice: expressAddon?.price,
      totalPrice: totalPrice,
    });

    // Step C: Trigger WhatsApp window opening
    try {
      window.open(waUrl, '_blank');
    } catch (openErr) {
      console.warn('Browser intercepted new tab:', openErr);
    }

    // Display confirmation modal with fallback link
    setModalData({
      isOpen: true,
      whatsappUrl: waUrl,
      customerName: customer.name.trim(),
      customerPhone: customer.phoneNumber.trim(),
      selectedItems: selectedItemsSummary,
      totalPrice: totalPrice,
    });

    // Refresh orders list to show the new record
    await loadOrders();

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Intro notice showing database connection status transparently */}
        <div className="bg-white border border-neutral-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-600 gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-neutral-400'
              }`}
            ></span>
            <span>
              {isSupabaseConfigured
                ? 'Terhubung dengan database Supabase PostgreSQL.'
                : 'Mode penyimpanan lokal aktif (Supabase env siap dikonfigurasi).'}
            </span>
          </div>
          <div className="text-neutral-500 font-mono text-[11px]">
            Rentang Harga: {formatRupiah(50000)} s/d {formatRupiah(115000)}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Selections */}
          <div className="lg:col-span-7 space-y-6">
            <PackageSelector
              packages={SERVICE_PACKAGES}
              selectedId={selectedPackageId}
              onSelect={handlePackageSelect}
            />

            <AddonSelector
              addons={SERVICE_ADDONS}
              selectedAddonIds={selectedAddonIds}
              onToggleAddon={handleToggleAddon}
            />

            <CustomerForm
              formData={customer}
              errors={formErrors}
              onChange={handleCustomerChange}
            />
          </div>

          {/* Right Column: Sticky Price Summary & WhatsApp Dispatch */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            <PriceSummary
              selectedPackage={selectedPackage}
              selectedAddons={selectedAddons}
              totalPrice={totalPrice}
              isSubmitting={isSubmitting}
              onSubmit={handleSendOrder}
            />

            {/* Service Guarantee Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-2 text-xs text-neutral-600">
              <h4 className="font-semibold text-neutral-900">Garansi &amp; Ketentuan Layanan:</h4>
              <ul className="space-y-1 text-neutral-500">
                <li>• Menggunakan sabun dan sikat khusus material sepatu premium.</li>
                <li>• Pengeringan alami tanpa pemanas ekstrem untuk menjaga lem sepatu.</li>
                <li>• Konfirmasi foto kondisi sepatu sebelum dan sesudah perawatan.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Order History with 3 Required States */}
        <OrderHistory
          orders={orders}
          status={historyStatus}
          errorMessage={historyError}
          onRefresh={loadOrders}
          onUpdateStatus={handleUpdateStatus}
          isUpdatingId={isUpdatingId}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Kalkulator Estimasi Layanan Sneaker &copy; {new Date().getFullYear()}</span>
          <span>WhatsApp Endpoint: +62 895-4146-26400</span>
        </div>
      </footer>

      {/* Confirmation Modal with Fallback Anchor Link */}
      <ConfirmationModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        whatsappUrl={modalData.whatsappUrl}
        customerName={modalData.customerName}
        customerPhone={modalData.customerPhone}
        selectedItems={modalData.selectedItems}
        totalPrice={modalData.totalPrice}
      />
    </div>
  );
}
