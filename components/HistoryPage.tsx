import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { HistoricalOrder, NotificationType } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface HistoryPageProps {
    onBack: () => void;
    showNotification: (message: string, type?: NotificationType) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, showNotification }) => {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orders, setOrders] = useState<HistoricalOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!/^09\d{8}$/.test(phone)) {
            showNotification('請輸入有效的10位手機號碼 (09開頭)', 'error');
            return;
        }
        if (name.trim() === '') {
            showNotification('請輸入姓名', 'error');
            return;
        }
        if (startDate && endDate && startDate > endDate) {
            showNotification('結束日期不能早於起始日期', 'error');
            return;
        }

        setIsLoading(true);
        setSearched(true);
        setOrders([]);

        try {
            const fetchedOrders = await apiService.getOrders({ 
                customerPhone: phone,
                customerName: name,
                startDate: startDate,
                endDate: endDate
            });
            setOrders(fetchedOrders);
            if (fetchedOrders.length === 0) {
                 showNotification('查無此條件的訂單記錄', 'info');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '查詢失敗';
            showNotification(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: 'pending' | 'confirmed' | 'cancelled') => {
        const config = {
            'pending': 'bg-yellow-200 text-yellow-800',
            'confirmed': 'bg-green-200 text-green-800',
            'cancelled': 'bg-red-200 text-red-800'
        };
        return config[status] || config.pending;
    };

    const getStatusText = (status: 'pending' | 'confirmed' | 'cancelled') => {
        const config = {
            'pending': '待確認',
            'confirmed': '已確認',
            'cancelled': '已取消'
        };
        return config[status] || '未知';
    };
    
    const formatDisplayTime = (timestamp: string) => new Date(timestamp).toLocaleString('zh-TW');

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <button onClick={onBack} className="text-blue-600 hover:underline text-sm clickable-btn">
                    &larr; 返回訂餐
                </button>
                <h2 className="text-xl font-bold text-gray-800">歷史訂單查詢</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                <div>
                    <label htmlFor="phone-search" className="block text-sm font-medium text-gray-700 mb-1">
                        手機號碼 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phone-search"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912345678"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="name-search" className="block text-sm font-medium text-gray-700 mb-1">
                        姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="name-search"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="王大明"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="start-date-search" className="block text-sm font-medium text-gray-700 mb-1">
                            起始日期 (選填)
                        </label>
                        <input
                            id="start-date-search"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date-search" className="block text-sm font-medium text-gray-700 mb-1">
                            結束日期 (選填)
                        </label>
                        <input
                            id="end-date-search"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white px-4 py-2.5 rounded-md text-sm disabled:bg-gray-400 flex items-center justify-center clickable-btn"
                >
                    {isLoading ? <LoadingSpinner /> : '查詢'}
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {isLoading && (
                    <div className="text-center text-gray-500">
                        <p>查詢中...</p>
                    </div>
                )}
                {!isLoading && searched && orders.length === 0 && (
                    <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-lg">
                        <p>找不到符合條件的訂單。</p>
                        <p className="text-sm">請確認手機、姓名和日期是否正確。</p>
                    </div>
                )}
                {!isLoading && orders.length > 0 && orders.map(order => (
                    <div key={order.orderId} className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs text-gray-500">訂單編號</p>
                                <p className="font-mono text-sm">{order.orderId}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>
                        <div className="text-sm space-y-1 text-gray-700">
                            <p><strong>時間:</strong> {formatDisplayTime(order.pickupTime)}</p>
                            <p><strong>總金額:</strong> <span className="font-bold text-green-600">${order.totalAmount}</span></p>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                            <p className="text-sm font-bold mb-1">訂單內容:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {order.items.map((item, index) => (
                                    <li key={index}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;