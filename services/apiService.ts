import { API_ENDPOINT, MENU_ITEMS } from '../constants';
import { MenuItemType, OrderData, HistoricalOrder, StatusType } from '../types';

async function request(payload: object): Promise<any> {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API 請求失敗:', error);
        throw new Error('網路連線失敗，請檢查網路連線和伺服器狀態');
    }
}

export const apiService = {
    async getMenu(): Promise<MenuItemType[]> {
        try {
            const result = await request({ action: 'getMenu' });
            if (result.success && Array.isArray(result.data)) {
                return result.data;
            }
            return MENU_ITEMS;
        } catch (error) {
            console.warn('獲取菜單失敗，使用默認菜單:', error);
            return MENU_ITEMS;
        }
    },

    async submitOrder(orderData: OrderData): Promise<any> {
        const orderDataForServer = {
            customerName: orderData.customerName.trim(),
            customerPhone: orderData.customerPhone.trim(),
            items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            pickupTime: orderData.pickupTime,
            deliveryAddress: orderData.deliveryAddress.trim(),
            notes: orderData.notes.trim(),
            status: 'pending'
        };

        const result = await request({
            action: 'createOrder',
            orderData: orderDataForServer
        });

        if (!result.success) {
            throw new Error(result.message || '訂單提交失敗');
        }

        return result;
    },

    async getOrders(params: { customerPhone: string; customerName: string; startDate: string; endDate: string; }): Promise<HistoricalOrder[]> {
        const searchParams = {
            customerPhone: params.customerPhone ? params.customerPhone.trim() : '',
            customerName: params.customerName ? params.customerName.trim() : '',
            startDate: params.startDate,
            endDate: params.endDate,
            exactMatch: true
        };

        const result = await request({
            action: 'getOrders',
            ...searchParams
        });

        if (!result.success) {
            throw new Error(result.message || '查詢失敗');
        }

        const orders: any[] = result.data || [];

        // When data is retrieved from backends like Google Apps Script, complex objects (arrays)
        // might be returned as JSON strings. We need to parse them to prevent runtime errors.
        return orders.map(order => {
            let items = order.items;

            if (typeof items === 'string') {
                try {
                    const parsedItems = JSON.parse(items);
                    if (Array.isArray(parsedItems)) {
                        items = parsedItems;
                    } else {
                        // If parsed data is not an array, default to an empty one.
                        items = [];
                    }
                } catch (e) {
                    console.error(`Failed to parse items for order ${order.orderId}:`, e);
                    // If parsing fails, use an empty array to prevent crashing the UI.
                    items = [];
                }
            }
            
            // Final safeguard to ensure items is always an array.
            if (!Array.isArray(items)) {
                console.warn(`Order ${order.orderId} has non-array items:`, items);
                items = [];
            }

            return { ...order, items };
        });
    }
};