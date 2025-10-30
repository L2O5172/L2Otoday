import React from 'react';
import { MenuItemType } from '../types';

interface MenuItemProps {
    item: MenuItemType;
    cartQuantity: number;
    onUpdateCart: (itemName: string, change: number) => void;
    onViewImage: (imageUrl: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, cartQuantity, onUpdateCart, onViewImage }) => {
    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div 
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => onViewImage(item.image)}
                >
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">{item.icon} {item.name}</h3>
                            <p className="text-green-600 font-bold text-sm">${item.price}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {item.status}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onUpdateCart(item.name, -1)}
                            disabled={cartQuantity === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold clickable-btn ${
                                cartQuantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                            }`}
                        >-</button>
                        
                        <span className="min-w-[2rem] text-center font-bold text-lg">{cartQuantity}</span>
                        
                        <button
                            onClick={() => onUpdateCart(item.name, 1)}
                            className="w-8 h-8 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 clickable-btn"
                        >+</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
