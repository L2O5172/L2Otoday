export interface MenuItem {
  name: string;
  price: number;
  icon: string;
  status: string;
  image: string;
}

export interface CartItem extends MenuItem {
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

export interface SubmittedOrderData extends OrderData {
  orderId: string;
  totalAmount: number;
}

export interface LiffUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
