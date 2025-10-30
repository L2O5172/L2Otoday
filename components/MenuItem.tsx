import React from 'react';
import { MenuItemType } from '../types';

interface MenuItemProps {
    item: MenuItemType;
    cartQuantity: number;
    onUpdateCart: (itemName: string, change: number) => void;
    onViewImage: (imageUrl: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, cartQuantity, onUpdateCart, onViewImage }) => {
    const isAvailable = item.status === '供應中';

    return (
        <div className={`bg-white rounded-lg p-2 border border-gray-200 shadow-sm flex flex-col h-full ${!isAvailable ? 'opacity-60' : ''}`}>
            <div 
                className="w-full h-20 rounded-md overflow-hidden cursor-pointer group relative"
                onClick={() => onViewImage(item.image)}
            >
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                <span className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded-full bg-opacity-80 backdrop-blur-sm ${
                    isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {item.status}
                </span>
            </div>
            
            <div className="flex-1 flex flex-col pt-2">
                <div className="flex-1 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.icon} {item.name}</h3>
                    <p className="text-green-600 font-bold text-sm">${item.price}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto h-7">
                     {isAvailable ? (
                        <>
                            <button
                                onClick={() => onUpdateCart(item.name, -1)}
                                disabled={cartQuantity === 0}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-lg clickable-btn ${
                                    cartQuantity === 0 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-red-500 hover:bg-red-600'
                                }`}
                                aria-label={`減少${item.name}數量`}
                            >-</button>
                            
                            <span className="min-w-[2rem] text-center font-bold text-base" aria-live="polite">
                                {cartQuantity > 0 ? cartQuantity : ''}
                            </span>

                            <button
                                onClick={() => onUpdateCart(item.name, 1)}
                                className="w-7 h-7 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 clickable-btn"
                                aria-label={`增加${item.name}數量`}
                            >+</button>
                        </>
                    ) : (
                        <span className="w-full text-center text-sm font-semibold text-gray-500 py-1">
                            本日售完
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItem;