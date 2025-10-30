import React, { useState, useCallback, useEffect } from 'react';
import OrderPage from './components/OrderPage';
import SuccessPage from './components/SuccessPage';
import HistoryPage from './components/HistoryPage';
import Notification from './components/Notification';
import LoadingSpinner from './components/LoadingSpinner';
import ImageModal from './components/ImageModal';
import { apiService } from './services/apiService';
import { SubmittedOrder, OrderData, NotificationType, MenuItemType } from './types';
import { MENU_ITEMS, STORE_INFO, DELIVERY_FEE } from './constants';

type View = 'order' | 'success' | 'history';

const App: React.FC = () => {
    const [view, setView] = useState<View>('order');
    const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
    const [notification, setNotification] = useState({ message: '', type: 'success' as NotificationType, visible: false });
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
        setNotification({ message, type, visible: true });
    }, []);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const items = await apiService.getMenu();
                setMenuItems(items);
            } catch (error) {
                setMenuItems(MENU_ITEMS);
                showNotification('菜單載入失敗，使用預設菜單', 'warning');
            } finally {
                setIsMenuLoading(false);
            }
        };
        fetchMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmitOrder = async (orderData: OrderData) => {
        try {
            const result = await apiService.submitOrder(orderData);
            const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (orderData.deliveryAddress ? DELIVERY_FEE : 0);

            const finalOrderData: SubmittedOrder = {
                ...orderData,
                orderId: result.data?.orderId || 'DEMO_' + Date.now(),
                totalAmount: result.data?.totalAmount || totalAmount
            };
            setSubmittedOrder(finalOrderData);
            setView('success');
            showNotification('訂單已送出！請手動分享給店家', 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知錯誤';
            showNotification(`訂單提交失敗：${errorMessage}`, 'error');
            throw error;
        }
    };

    const handleNewOrder = () => {
        setSubmittedOrder(null);
        setView('order');
    };

    const handleViewImage = (imageUrl: string) => {
        setViewingImage(imageUrl);
    };

    const handleCloseImage = () => {
        setViewingImage(null);
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
            case 'history':
                return <HistoryPage onBack={() => setView('order')} showNotification={showNotification} />;
            case 'success':
                return submittedOrder && <SuccessPage orderData={submittedOrder} onNewOrder={handleNewOrder} showNotification={showNotification} />;
            default:
                return <OrderPage menuItems={menuItems} onSubmitOrder={handleSubmitOrder} showNotification={showNotification} onViewHistory={() => setView('history')} onViewImage={handleViewImage} />;
        }
    };

    return (
        <div className="p-4 min-h-screen flex items-center justify-center">
            <div className="container max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden no-print">
                <div className="bg-[#fff3cd] border-b border-[#ffeaa7] rounded-t-2xl p-2.5 text-xs text-center text-[#856404]">
                    <span role="img" aria-label="lock">🔒</span> 安全訂餐系統
                </div>

                <header className="bg-green-500 text-white p-5 text-center relative">
                    <h1 className="text-2xl font-bold mb-1">🍜 {STORE_INFO.NAME}</h1>
                    <p className="text-sm opacity-90">快速訂餐系統</p>
                </header>

                <main className="p-5">
                    {renderContent()}
                </main>
                
                <footer className="bg-gray-100 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
                    <p>📍 營業時間: {STORE_INFO.OPERATING_HOURS} | 📞 聯絡電話: {STORE_INFO.PHONE}</p>
                    <p className="mt-1">💬 店家LINE: {STORE_INFO.LINE_ID}</p>
                </footer>
            </div>
            <Notification
                message={notification.message}
                type={notification.type}
                visible={notification.visible}
                onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
            />
            {viewingImage && <ImageModal imageUrl={viewingImage} onClose={handleCloseImage} />}
        </div>
    );
};

export default App;