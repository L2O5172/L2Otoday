import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem as MenuItemType, CartItem, OrderData, NotificationType } from '../types';
import { useLiff } from '../hooks/useLiff';
import { DELIVERY_FEE } from '../constants';
import MenuItem from './MenuItem';
import LoadingSpinner from './LoadingSpinner';

interface OrderPageProps {
    menuItems: MenuItemType[];
    onSubmitOrder: (orderData: OrderData, idToken: string | null) => Promise<void>;
    showNotification: (message: string, type?: NotificationType) => void;
}

const OrderPage: React.FC<OrderPageProps> = ({ menuItems, onSubmitOrder, showNotification }) => {
    const { profile, idToken } = useLiff();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [timeError, setTimeError] = useState('');

    useEffect(() => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        setPickupDate(today);
        
        now.setMinutes(now.getMinutes() + 30);
        const minutes = Math.ceil(now.getMinutes() / 15) * 15; // Round up to nearest 15 mins
        now.setMinutes(minutes);
        const timeString = now.toTimeString().slice(0, 5);
        setPickupTime(timeString);
    }, []);

    useEffect(() => {
        if (profile?.displayName) {
            setCustomerName(profile.displayName);
        }
    }, [profile]);

    const { subtotal, deliveryFee, totalAmount } = useMemo(() => {
        const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const fee = deliveryAddress.trim() ? DELIVERY_FEE : 0;
        return { subtotal: sub, deliveryFee: fee, totalAmount: sub + fee };
    }, [cart, deliveryAddress]);

    const updateCart = (itemName: string, change: number) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.name === itemName);
            
            if (existingIndex === -1) {
                if (change > 0) {
                    const menuItem = menuItems.find(item => item.name === itemName);
                    return menuItem ? [...prevCart, { ...menuItem, quantity: 1 }] : prevCart;
                }
                return prevCart;
            }
            
            const newCart = [...prevCart];
            const newQuantity = newCart[existingIndex].quantity + change;
            
            if (newQuantity <= 0) {
                newCart.splice(existingIndex, 1);
            } else {
                newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity };
            }
            
            return newCart;
        });
    };

    const getItemQuantity = (itemName: string) => cart.find(item => item.name === itemName)?.quantity || 0;

    const clearCart = () => {
        if (window.confirm('確定要清空購物車嗎？')) setCart([]);
    };

    const dateOptions = useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })
            });
        }
        return dates;
    }, []);

    const timeOptions = useMemo(() => {
        const times = [];
        for (let hour = 10; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            }
        }
        return times;
    }, []);

    const getFullPickupTime = () => pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : '';

    const validateForm = () => {
        let isValid = true;
        setPhoneError('');
        setTimeError('');

        if (!/^09\d{8}$/.test(customerPhone)) {
            setPhoneError('請輸入有效的10位手機號碼 (09開頭)');
            isValid = false;
        }

        if (!pickupDate || !pickupTime) {
            setTimeError('請選擇取餐日期和時間');
            isValid = false;
        } else {
            const selectedDateTime = new Date(getFullPickupTime());
            const minDateTime = new Date();
            minDateTime.setMinutes(minDateTime.getMinutes() + 29);
            
            if (selectedDateTime < minDateTime) {
                setTimeError('取餐時間必須在30分鐘之後');
                isValid = false;
            }
        }
        
        if (cart.length === 0) {
            showNotification('請至少選擇一個餐點', 'error');
            isValid = false;
        }
        
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await onSubmitOrder({ 
                customerName, 
                customerPhone,
                items: cart, 
                pickupTime: getFullPickupTime(), 
                deliveryAddress, 
                notes 
            }, idToken);
        } catch (error) {
            // Error is handled in the parent component
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-4">
            <div>
                <label className="block mb-2 font-bold text-gray-700 text-sm">姓名 <span className="text-red-500">*</span></label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="請輸入姓名" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500" />
            </div>
            
            <div>
                <label className="block mb-2 font-bold text-gray-700 text-sm">手機號碼 <span className="text-red-500">*</span></label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="0936220000" className={`w-full p-3 border rounded-lg text-sm focus:ring-green-500 focus:border-green-500 ${phoneError ? 'border-red-500' : 'border-gray-300'}`} />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                <p className="text-xs text-gray-500 mt-1">請輸入09開頭的10位手機號碼</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-bold text-gray-700 text-sm">取餐日期 <span className="text-red-500">*</span></label>
                    <select value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500">
                        {dateOptions.map(date => <option key={date.value} value={date.value}>{date.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-bold text-gray-700 text-sm">取餐時間 <span className="text-red-500">*</span></label>
                    <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={`w-full p-3 border rounded-lg text-sm focus:ring-green-500 focus:border-green-500 ${timeError ? 'border-red-500' : 'border-gray-300'}`}>
                        {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                    </select>
                </div>
            </div>
            {timeError && <p className="text-red-500 text-xs -mt-3">{timeError}</p>}
            
            <div>
                <label className="block mb-2 font-bold text-gray-700 text-sm">外送地點 (選填)</label>
                <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="如需外送請填寫地址" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500" />
                <p className="text-xs text-gray-500 mt-1">※ 填寫地址將計算 ${DELIVERY_FEE} 元外送費</p>
            </div>
            
            <div>
                <label className="block mb-2 font-bold text-gray-700 text-sm">備註 (選填)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="例如：不要香菜、加辣等" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500" />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <h2 className="text-center text-lg font-bold text-gray-800 mb-4">📝 選擇餐點</h2>
                <div className="space-y-3">
                    {menuItems.map(item => <MenuItem key={item.name} item={item} cartQuantity={getItemQuantity(item.name)} onUpdateCart={updateCart} />)}
                </div>
            </div>

            {cart.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">🛒 訂單明細 ({cart.reduce((sum, item) => sum + item.quantity, 0)} 項)</h2>
                        <button onClick={clearCart} className="text-xs bg-red-100 text-red-600 hover:bg-red-500 hover:text-white font-semibold py-1 px-3 rounded-full clickable-btn">🗑️ 清空</button>
                    </div>
                    <div className="space-y-2">
                        {cart.map(item => (
                            <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{item.icon} {item.name}</p>
                                    <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                                </div>
                                <p className="font-bold text-green-600">${item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2 mt-4">
                <div className="flex justify-between text-sm text-gray-600"><span>餐點總計:</span><span>${subtotal}</span></div>
                {deliveryFee > 0 && <div className="flex justify-between text-sm text-gray-600"><span>外送費:</span><span>${deliveryFee}</span></div>}
                <div className="flex justify-between font-bold text-lg text-gray-800 border-t border-gray-300 pt-3 mt-3"><span>總金額:</span><span>${totalAmount}</span></div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <p className="text-sm text-blue-800"><span className="font-bold">📨 重要提醒：</span><br/>下單後請分享確認信給店家，待店家回覆確認後訂單才成立</p>
            </div>
            
            <div className="mt-6">
                <button onClick={handleSubmit} disabled={cart.length === 0 || isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center clickable-btn">
                    {isLoading ? <><LoadingSpinner /><span>處理中...</span></> : <span>📨 送出訂單（待確認）</span>}
                </button>
            </div>
        </div>
    );
};

export default OrderPage;
