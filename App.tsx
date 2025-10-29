import React, { useState, useCallback, useEffect } from 'react';
import OrderPage from './components/OrderPage';
import SuccessPage from './components/SuccessPage';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import { getMenu, submitOrder } from './services/apiService';
import { MenuItem, OrderData, SubmittedOrderData, NotificationType } from './types';
import { DEFAULT_MENU, DELIVERY_FEE, STORE_LINE_ID } from './constants';

const App: React.FC = () => {
    const [view, setView] = useState<'order' | 'success'>('order');
    const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrderData | null>(null);
    const [notification, setNotification] = useState({ message: '', type: 'success' as NotificationType, visible: false });
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);

    const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
        setNotification({ message, type, visible: true });
    }, []);

    useEffect(() => {
        const fetchMenu = async () => {
            setIsMenuLoading(true);
            try {
                const items = await getMenu();
                setMenuItems(items);
            } catch (error) {
                console.error("Failed to fetch menu, using default.", error);
                setMenuItems(DEFAULT_MENU);
                showNotification("無法載入菜單，使用預設菜單", "warning");
            } finally {
                setIsMenuLoading(false);
            }
        };
        fetchMenu();
    }, [showNotification]);

    const handleSubmitOrder = async (orderData: OrderData, idToken: string | null) => {
        try {
            const result = await submitOrder(orderData, idToken);
            const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const total = subtotal + (orderData.deliveryAddress ? DELIVERY_FEE : 0);

            const finalOrderData: SubmittedOrderData = {
                ...orderData,
                orderId: result.data?.orderId || 'TEST_' + Date.now(),
                totalAmount: result.data?.totalAmount || total
            };
            
            setSubmittedOrder(finalOrderData);
            setView('success');
            showNotification('訂單已暫存！請分享確認信給店家');
        } catch (error: any) {
            showNotification(`訂單提交失敗：${error.message}`, 'error');
            throw error;
        }
    };

    const handleNewOrder = () => {
        setSubmittedOrder(null);
        setView('order');
    };

    const renderContent = () => {
        if (isMenuLoading) {
            return (
                <div className="text-center py-20 flex flex-col items-center justify-center text-gray-600">
                    <LoadingSpinner />
                    <p className="mt-3 text-sm">正在載入菜單...</p>
                </div>
            );
        }

        switch (view) {
            case 'success':
                return submittedOrder && <SuccessPage orderData={submittedOrder} onNewOrder={handleNewOrder} showNotification={showNotification} />;
            default:
                return <OrderPage menuItems={menuItems} onSubmitOrder={handleSubmitOrder} showNotification={showNotification} />;
        }
    };

    return (
        <div className="p-4 min-h-screen flex items-center justify-center">
            <div className="container max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-[#fff3cd] border-b border-[#ffeaa7] p-2.5 text-xs text-center text-[#856404]">
                    <span role="img" aria-label="lock">🔒</span> 安全訂餐系統 - 需店家確認後成立
                </div>

                <header className="bg-green-500 text-white p-5 text-center relative">
                    <h1 className="text-2xl font-bold mb-1">🍜 台灣小吃店</h1>
                    <p className="text-sm opacity-90">LINE 快速訂餐 - 需店家確認</p>
                </header>

                <main className="p-5">
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        visible={notification.visible}
                        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
                    />
                    {renderContent()}
                </main>
                
                <footer className="bg-gray-100 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
                    <p>📍 營業時間: 10:00 - 21:00 | 📞 聯絡電話: 02-1234-5678</p>
                    <p className="mt-1">💬 店家LINE: {STORE_LINE_ID}</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
