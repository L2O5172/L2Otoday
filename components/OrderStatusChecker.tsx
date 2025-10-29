import React, { useState, useEffect } from 'react';
import { checkOrderStatus } from '../services/apiService';
import { OrderStatus } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface OrderStatusCheckerProps {
    orderId: string;
    onStatusChange: (status: OrderStatus) => void;
}

const OrderStatusChecker: React.FC<OrderStatusCheckerProps> = ({ orderId, onStatusChange }) => {
    const [status, setStatus] = useState<OrderStatus>('pending');
    const [isChecking, setIsChecking] = useState(false);

    const checkStatus = async () => {
        setIsChecking(true);
        try {
            const result = await checkOrderStatus(orderId);
            setStatus(result.status);
            onStatusChange(result.status);
        } catch (error) {
            console.error('檢查狀態失敗:', error);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const getStatusInfo = () => {
        const statusConfig: Record<OrderStatus, { color: string, icon: string, text: string, description: string }> = {
            'pending': { 
                color: 'bg-yellow-100 border-yellow-400 text-yellow-800',
                icon: '⏳',
                text: '等待店家確認',
                description: '請分享確認信給店家，等待店家回覆確認'
            },
            'confirmed': { 
                color: 'bg-green-100 border-green-400 text-green-800',
                icon: '✅',
                text: '訂單已確認',
                description: '店家已確認您的訂單，請準時取餐'
            },
            'cancelled': { 
                color: 'bg-red-100 border-red-400 text-red-800',
                icon: '❌',
                text: '訂單已取消',
                description: '店家已取消此訂單'
            }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`p-4 rounded-lg border ${statusInfo.color} mb-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-2xl mr-3">{statusInfo.icon}</span>
                    <div>
                        <h3 className="font-bold">{statusInfo.text}</h3>
                        <p className="text-sm opacity-80">{statusInfo.description}</p>
                    </div>
                </div>
                <button 
                    onClick={checkStatus}
                    disabled={isChecking}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400 clickable-btn"
                >
                    {isChecking ? <LoadingSpinner /> : '刷新'}
                </button>
            </div>
        </div>
    );
};

export default OrderStatusChecker;
