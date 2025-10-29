import { API_ENDPOINT, DEFAULT_MENU } from '../constants';
import { MenuItem, OrderData, OrderStatus } from '../types';

async function request(payload: object) {
    try {
        console.log('發送請求:', (payload as { action: string }).action);
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
        console.log('收到回應:', result);
        return result;
    } catch (error) {
        console.error('API 請求失敗:', error);
        throw new Error('網路連線失敗，請檢查網路連線和伺服器狀態');
    }
}

export const getMenu = async (): Promise<MenuItem[]> => {
    try {
        const result = await request({ action: 'getMenu' });
        if (result.success && Array.isArray(result.data)) {
            return result.data;
        }
        return DEFAULT_MENU;
    } catch (error) {
        console.warn('獲取菜單失敗，使用默認菜單:', error);
        return DEFAULT_MENU;
    }
};

export const submitOrder = async (orderData: OrderData, idToken: string | null) => {
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

    console.log('提交訂單數據:', orderDataForServer);

    const result = await request({
        action: 'createOrder',
        idToken: idToken,
        orderData: orderDataForServer
    });

    if (!result.success) {
        throw new Error(result.message || '訂單提交失敗');
    }

    return result;
};

export const checkOrderStatus = async (orderId: string): Promise<{ status: OrderStatus }> => {
    const result = await request({
        action: 'checkOrderStatus',
        orderId: orderId
    });

    if (!result.success) {
        throw new Error(result.message || '查詢狀態失敗');
    }

    return result.data;
};
