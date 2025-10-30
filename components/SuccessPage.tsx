import React from 'react';
import { SubmittedOrder, NotificationType } from '../types';

interface SuccessPageProps {
    orderData: SubmittedOrder;
    onNewOrder: () => void;
    showNotification: (message: string, type?: NotificationType) => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ orderData, onNewOrder, showNotification }) => {
    const formatDisplayTime = (timestamp: string) => new Date(timestamp).toLocaleString('zh-TW', { dateStyle: 'short', timeStyle: 'short' });

    const customerShareText = `🍽️ 台灣小吃店 - 訂單詳細資訊\n\n📋 訂單編號：${orderData.orderId}\n👤 顧客姓名：${orderData.customerName}\n📞 聯絡電話：${orderData.customerPhone}\n\n💰 總金額：$${orderData.totalAmount}\n⏰ 取餐時間：${formatDisplayTime(orderData.pickupTime)}\n📍 ${orderData.deliveryAddress ? `外送地址：${orderData.deliveryAddress}` : '自取'}\n📝 備註：${orderData.notes || '無'}\n\n📍 取餐地址：台灣小吃店\n🕒 營業時間：10:00-21:00\n📞 店家電話：02-1234-5678`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(customerShareText)
            .then(() => {
                showNotification('訂單資訊已複製！', 'success');
            })
            .catch(err => {
                console.error('複製訂單資訊失敗:', err);
                showNotification('複製失敗，您的瀏覽器可能不支援此功能', 'error');
            });
    };

    return (
        <div className="text-center p-5 animate-fade-in print-only-container">
             <div className="print-content">
                <div className="text-6xl mb-5 no-print">✅</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">訂單已送出</h3>
                <p className="text-gray-600 mb-6 no-print">感謝您的訂購！以下是您的訂單詳情。</p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-5 text-left border">
                    <p><strong>訂單編號：</strong><span className="font-mono">{orderData.orderId}</span></p>
                    <p><strong>顧客姓名：</strong><span>{orderData.customerName}</span></p>
                    <p><strong>聯絡電話：</strong><span>{orderData.customerPhone}</span></p>
                    <p><strong>總金額：</strong>$<span className="text-green-600 font-bold">{orderData.totalAmount}</span></p>
                    <p><strong>取餐時間：</strong><span>{formatDisplayTime(orderData.pickupTime)}</span></p>
                    <p><strong>取餐方式：</strong><span>{orderData.deliveryAddress ? '外送' : '自取'}</span></p>
                    {orderData.deliveryAddress && <p><strong>外送地址：</strong><span>{orderData.deliveryAddress}</span></p>}
                    {orderData.notes && <p><strong>備註：</strong><span>{orderData.notes}</span></p>}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="font-bold mb-2">🛒 訂單內容：</p>
                        {orderData.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-200 no-print">
                    <h4 className="font-bold text-lg mb-3">儲存或分享訂單</h4>
                    <div className="space-y-3">
                        <a href={`https://line.me/R/msg/text/?${encodeURIComponent(customerShareText)}`} target="_blank" rel="noopener noreferrer" className="block bg-[#06c755] text-white py-3 px-4 rounded-lg font-bold clickable-btn text-sm">
                            💬 分享到 LINE
                        </a>
                        <button onClick={copyToClipboard} className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-bold clickable-btn text-sm">
                            📝 複製訂單資訊
                        </button>
                        <button onClick={() => window.print()} className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-bold clickable-btn text-sm">
                            🖨️ 列印訂單
                        </button>
                    </div>
                </div>

                <div className="mt-6 no-print">
                    <button onClick={onNewOrder} className="w-full bg-green-600 text-white py-3 px-4 rounded-lg clickable-btn">
                        📝 返回主頁再訂一單
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
