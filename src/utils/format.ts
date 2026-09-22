export const BUSINESS_WHATSAPP_NUMBER = '62895414626400';

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

export function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('08')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  return digits;
}

export function isValidIndonesianPhone(phone: string): boolean {
  const sanitized = sanitizePhoneNumber(phone);
  return sanitized.startsWith('628') && sanitized.length >= 10 && sanitized.length <= 15;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function buildWhatsAppUrl(params: {
  customerName: string;
  customerPhone: string;
  packageName: string;
  packagePrice: number;
  addonName?: string;
  addonPrice?: number;
  totalPrice: number;
}): string {
  const addonText = params.addonName && params.addonPrice
    ? `${params.addonName} (${formatRupiah(params.addonPrice)})`
    : 'Tidak ada';

  const lines = [
    'Halo Admin, saya ingin memesan layanan cuci sepatu:',
    '',
    '*Rincian Pesanan:*',
    `- Layanan: ${params.packageName} (${formatRupiah(params.packagePrice)})`,
    `- Tambahan: ${addonText}`,
    `- Total Estimasi: ${formatRupiah(params.totalPrice)}`,
    '',
    '*Data Pelanggan:*',
    `- Nama: ${params.customerName.trim()}`,
    `- No. WhatsApp: ${params.customerPhone.trim()}`,
    '',
    'Mohon konfirmasi ketersediaan slot. Terima kasih!',
  ];

  const message = lines.join('\n');
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
