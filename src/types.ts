export interface ServicePackage {
  id: 'basic-clean' | 'deep-clean';
  name: string;
  price: number;
  description: string;
  turnaroundTime: string;
  features: string[];
}

export interface ServiceAddon {
  id: 'express-delivery';
  name: string;
  price: number;
  description: string;
  turnaroundTime: string;
}

export interface CustomerForm {
  name: string;
  phoneNumber: string;
}

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  selected_items: string;
  total_price: number;
  status: 'pending' | 'processed';
  created_at: string;
}

export type HistoryStatus = 'loading' | 'empty' | 'ready' | 'error';
