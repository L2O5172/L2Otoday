import React from 'react';
import { SubmittedOrderData } from '../types';
import { STORE_LINE_ID } from '../constants';

interface PrintConfirmationProps {
    orderData: SubmittedOrderData;
    isOpen: boolean;
    onClose: () => void;
}

const PrintConfirmation: React.FC<PrintConfirmationProps> = ({ orderData, isOpen, onClose }) => {
    const formatDisplayTime = (timestamp: string | number) => new Date(timestamp).toLocaleString('zh-TW');

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 no-print">
                        <h3 className="text-xl font-bold">列印確認單</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                    
                    <div className="print-confirmation border-2 border-dashed border-gray-300 p-6 bg-white">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-green-600">台灣小吃店</h1>
                            <p className="text-gray-600">訂單確認單</p>
                        </div>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">訂單編號：</span>
                                <span>{orderData.orderId}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">顧客姓名：</span>
                                <span>{orderData.customerName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">聯絡電話：</span>
                                <span>{orderData.customerPhone}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">總金額：</span>
                                <span className="text-green-600 font-bold">${orderData.totalAmount}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">取餐時間：</span>
                                <span>{formatDisplayTime(orderData.pickupTime)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">取餐方式：</span>
                                <span>{orderData.deliveryAddress ? '外送' : '自取'}</span>
                            </div>
                            {orderData.deliveryAddress && (
                                <div className="border-b pb-2">
                                    <span className="font-bold">外送地址：</span>
                                    <p className="text-sm mt-1">{orderData.deliveryAddress}</p>
                                </div>
                            )}
                            {orderData.notes && (
                                <div className="border-b pb-2">
                                    <span className="font-bold">備註：</span>
                                    <p className="text-sm mt-1">{orderData.notes}</p>
                                </div>
                            )}
                            
                            <div className="mt-4">
                                <p className="font-bold mb-2">訂單內容：</p>
                                {orderData.items.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm border-b pb-1 mb-1">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 pt-4 border-t-2 border-gray-300 text-center">
                                <p className="text-xs text-gray-600">下單時間：{new Date().toLocaleString('zh-TW')}</p>
                                <p className="text-xs text-gray-600 mt-2">※ 請出示此確認單取餐</p>
                                <p className="text-xs text-gray-600">店家LINE：{STORE_LINE_ID}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6 no-print">
                        <button 
                            onClick={handlePrint}
                            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-bold clickable-btn"
                        >
                            🖨️ 列印確認單
                        </button>
                        <button 
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-bold clickable-btn"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintConfirmation;
