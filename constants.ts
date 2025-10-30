
import { MenuItemType } from './types';

export const LIFF_ID = '2008316489-6nMjb0KX';
export const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxkiCWJjuew-82ewrIgCCVctbpIIyalrCMfJBwg5tjrfXIG2cIisG9dynjJBAFocIMP/exec';
export const DELIVERY_FEE = 30;
export const STORE_LINE_ID = '@561zotgq';

export const DEFAULT_MENU: MenuItemType[] = [
    { name: '滷肉飯', price: 35, icon: '🍚', status: '供應中', image: 'https://picsum.photos/seed/braisedpork/400/300' },
    { name: '雞肉飯', price: 40, icon: '🍗', status: '供應中', image: 'https://picsum.photos/seed/chickenrice/400/300' },
    { name: '蚵仔煎', price: 65, icon: '🍳', status: '供應中', image: 'https://picsum.photos/seed/oysteromelette/400/300' },
    { name: '大腸麵線', price: 50, icon: '🍜', status: '供應中', image: 'https://picsum.photos/seed/noodles/400/300' },
    { name: '珍珠奶茶', price: 45, icon: '🥤', status: '供應中', image: 'https://picsum.photos/seed/bubbletea/400/300' }
];
