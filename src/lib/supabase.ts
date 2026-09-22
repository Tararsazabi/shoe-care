import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'sneaker_clean_order_history';

function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Graceful fallback if storage quota exceeded
  }
}

export async function fetchOrdersFromDb(): Promise<{ data: OrderRecord[]; error: Error | null }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, reading local fallback:', error.message);
        return { data: getLocalOrders(), error: new Error(error.message) };
      }

      return { data: (data as OrderRecord[]) || [], error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown fetch error';
      console.warn('Supabase fetch exception:', message);
      return { data: getLocalOrders(), error: new Error(message) };
    }
  }

  // Fallback when Supabase is unconfigured
  return { data: getLocalOrders(), error: null };
}

export async function insertOrderToDb(orderPayload: {
  customer_name: string;
  customer_phone: string;
  selected_items: string;
  total_price: number;
}): Promise<{ data: OrderRecord | null; error: Error | null }> {
  const localRecord: OrderRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    customer_name: orderPayload.customer_name,
    customer_phone: orderPayload.customer_phone,
    selected_items: orderPayload.selected_items,
    total_price: orderPayload.total_price,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  // Always persist to local backup
  const existing = getLocalOrders();
  saveLocalOrders([localRecord, ...existing]);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: orderPayload.customer_name,
            customer_phone: orderPayload.customer_phone,
            selected_items: orderPayload.selected_items,
            total_price: orderPayload.total_price,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert warning, order saved locally:', error.message);
        return { data: localRecord, error: new Error(error.message) };
      }

      return { data: (data as OrderRecord) || localRecord, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown insert error';
      console.warn('Supabase insert exception, order saved locally:', message);
      return { data: localRecord, error: new Error(message) };
    }
  }

  return { data: localRecord, error: null };
}

export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: 'pending' | 'processed'
): Promise<{ success: boolean; error: Error | null }> {
  // Update local storage
  const existing = getLocalOrders();
  const updated = existing.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  saveLocalOrders(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.warn('Supabase update warning, local status updated:', error.message);
        return { success: false, error: new Error(error.message) };
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown update error';
      console.warn('Supabase update exception:', message);
      return { success: false, error: new Error(message) };
    }
  }

  return { success: true, error: null };
}
