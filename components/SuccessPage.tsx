import React, { useState } from 'react';
import { SubmittedOrderData, NotificationType, OrderStatus } from '../types';
import OrderStatusChecker from './OrderStatusChecker';
import PrintConfirmation from './PrintConfirmation';

interface SuccessPageProps {
    orderData: SubmittedOrderData;
    onNewOrder: () => void;
    showNotification: (message: string, type?: NotificationType) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ orderData, onNewOrder, showNotification }) => {
    const formatDisplayTime = (timestamp: string) => new Date(timestamp).toLocaleString('zh-TW');
    const [, setCurrentStatus] = useState<OrderStatus>('pending');
    const [hasShared, setHasShared] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    const storeConfirmationText = `🏪 【台灣小吃店 - 訂單確認信】\n\n📋 訂單編號：${orderData.orderId}\n👤 顧客姓名：${orderData.customerName}\n📞 聯絡電話：${orderData.customerPhone}\n\n🛒 訂單內容：\n${orderData.items.map(item => `• ${item.name} x ${item.quantity} = $${item.price * item.quantity}`).join('\n')}\n\n💰 總金額：$${orderData.totalAmount}\n⏰ 取餐時間：${formatDisplayTime(orderData.pickupTime)}\n📍 ${orderData.deliveryAddress ? `外送地址：${orderData.deliveryAddress}` : '自取'}\n📝 備註：${orderData.notes || '無'}\n\n⏱️ 下單時間：${new Date().toLocaleString('zh-TW')}\n\n💬 請店家回覆「確認」以成立訂單`;

    const handleShareToStore = () => {
        const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(storeConfirmationText)}`;
        window.open(shareUrl, '_blank');
        setHasShared(true);
        showNotification('請在 LINE 分享畫面中選擇店家帳號發送確認信', 'info');
    };

    return (
        <div className="text-center p-5 animate-fade-in">
            <div className="text-6xl mb-5">📨</div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">訂單已暫存！</h3>
            <p className="text-gray-600 mb-6">請分享確認信給店家，待店家回覆確認後訂單才成立</p>
            
            <OrderStatusChecker 
                orderId={orderData.orderId} 
                onStatusChange={setCurrentStatus}
            />

            <div className="bg-gray-50 p-4 rounded-lg my-5 text-left border">
                <p><strong>訂單編號：</strong><span className="font-mono">{orderData.orderId}</span></p>
                <p><strong>顧客姓名：</strong><span>{orderData.customerName}</span></p>
                <p><strong>聯絡電話：</strong><span>{orderData.customerPhone}</span></p>
                <p><strong>總金額：</strong>$<span className="text-green-600 font-bold">{orderData.totalAmount}</span></p>
                <p><strong>取餐時間：</strong><span>{formatDisplayTime(orderData.pickupTime)}</span></p>
                <p><strong>取餐方式：</strong><span>{orderData.deliveryAddress ? '外送' : '自取'}</span></p>
                {orderData.deliveryAddress && <p><strong>外送地址：</strong><span>{orderData.deliveryAddress}</span></p>}
                {orderData.notes && <p><strong>備註：</strong><span>{orderData.notes}</span></p>}
            </div>

            <div className="my-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-lg mb-3">📤 發送確認信給店家</h4>
                {!hasShared ? (
                    <>
                        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-300">
                            <p className="text-sm text-gray-800 font-bold mb-2">📝 操作步驟：</p>
                            <ol className="text-sm text-gray-600 text-left list-decimal list-inside space-y-2">
                                <li>選擇下方任一方式發送確認信</li>
                                <li>等待店家回覆「確認」</li>
                                <li>訂單狀態會自動更新為「已確認」</li>
                            </ol>
                        </div>
                        <div className="space-y-3">
                            <button onClick={handleShareToStore} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg clickable-btn">
                                💬 LINE 分享確認信
                            </button>
                            <button onClick={() => setShowPrintModal(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg text-lg clickable-btn">
                                🖨️ 列印確認單
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="font-bold text-green-800 mb-2">確認信已發送！</p>
                        <p className="text-sm text-green-600">請等待店家回覆「確認」<br/>訂單狀態會自動更新</p>
                        <button onClick={() => setShowPrintModal(true)} className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg clickable-btn">
                            🖨️ 列印確認單備用
                        </button>
                    </div>
                )}
            </div>

            <div className="my-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs text-red-800 font-bold">⚠️ 重要提醒：</p>
                <ul className="text-xs text-red-600 mt-1 text-left list-disc list-inside space-y-1">
                    <li>必須收到店家回覆「確認」後，訂單才算成立</li>
                    <li>未收到店家確認前，請勿前往取餐</li>
                    <li>店家可能因庫存或營業時間取消訂單</li>
                </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={onNewOrder} className="bg-green-600 text-white py-3 px-4 rounded-lg clickable-btn">
                    📝 再訂一單
                </button>
                <button onClick={() => window.location.reload()} className="bg-blue-600 text-white py-3 px-4 rounded-lg clickable-btn">
                    🔄 刷新狀態
                </button>
            </div>

            <PrintConfirmation 
                orderData={orderData}
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
            />
        </div>
    );
};

export default SuccessPage;
