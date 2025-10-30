
export interface MenuItemType {
  name: string;
  price: number;
  icon: string;
  status: string;
  image: string;
}

export interface CartItem extends MenuItemType {
  quantity: number;
}

export interface OrderData {
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  pickupTime: string;
  deliveryAddress: string;
  notes: string;
}

export interface SubmittedOrder extends OrderData {
  orderId: string;
  totalAmount: number;
}

export interface HistoricalOrder {
    orderId: string;
    customerName: string;
    customerPhone: string;
    items: { name: string; quantity: number; price: number }[];
    pickupTime: string;
    deliveryAddress: string;
    notes: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    totalAmount: number;
    createdAt: string;
}

// FIX: Added LiffProfile interface to resolve missing module member error.
export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type StatusType = 'pending' | 'confirmed' | 'cancelled';