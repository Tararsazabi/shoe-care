import { ServicePackage, ServiceAddon } from '../types';

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'basic-clean',
    name: 'Basic Clean',
    price: 50000,
    description: 'Pembersihan standar permukaan luar, upper mesh, dan midsole.',
    turnaroundTime: 'Estimasi pengerjaan: 2-3 hari kerja',
    features: [
      'Pembersihan upper mesh & midsole',
      'Penyikatan outsole ringan',
      'Pembersihan tali sepatu standar',
      'Pemberian pewangi sepatu',
    ],
  },
  {
    id: 'deep-clean',
    name: 'Deep Clean',
    price: 90000,
    description: 'Pembersihan mendalam menyeluruh hingga material terdalam, insole, dan treatment un-yellowing.',
    turnaroundTime: 'Estimasi pengerjaan: 3-4 hari kerja',
    features: [
      'Pembersihan deep material extraction',
      'Pembersihan insole & lining dalam',
      'Lace deep wash & detailing',
      'Treatment anti jamur & un-yellowing',
      'Pemberian antibakteri & premium fragrance',
    ],
  },
];

export const SERVICE_ADDONS: ServiceAddon[] = [
  {
    id: 'express-delivery',
    name: 'Express Delivery',
    price: 25000,
    description: 'Layanan prioritas kilat dengan pengerjaan cepat dan pengiriman siap dalam 24 jam.',
    turnaroundTime: 'Siap dalam 24 jam',
  },
];
