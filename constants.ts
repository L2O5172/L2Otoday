import { MenuItemType } from './types';

// =================================================================
// 🚀 店家設定懶人包 (Store Configuration Lazy Pack)
// =================================================================
// 只要修改這個檔案，就可以客製化成您專屬的訂餐系統！
// Just modify this file to customize your own ordering system!

/**
 * 步驟 1：填寫您的店家基本資訊
 * Step 1: Fill in your store's basic information
 */
export const STORE_INFO = {
    NAME: '您的店名 (例如：美味便當)',
    LINE_ID: '@yourlineid', // 您的 LINE 官方帳號 ID
    PHONE: '02-1234-5678', // 您的聯絡電話
    ADDRESS: '您的店家地址', // 您的取餐地址
    OPERATING_HOURS: '10:00 - 20:00', // 您的營業時間
};

/**
 * 步驟 2：填寫您的 Google Apps Script 金鑰
 * Step 2: Fill in your Google Apps Script key
 */
// 請到 Google Apps Script 部署您的後端程式，並將產生的網址貼在下方
export const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwy6JRELr2_uT5nhRE23nQaI_eQuf6mc7hDClE0f74bCLCsOjmj6qGgYcMmZ1sIMfud/exec';

// FIX: Added LIFF_ID export to resolve missing module member error.
/**
 * (選填) 步驟 2.1：如果您想整合 LINE LIFF，請填寫您的 LIFF ID
 * (Optional) Step 2.1: If you want to integrate LINE LIFF, fill in your LIFF ID
 */
export const LIFF_ID = ''; // 例如 '1234567890-AbcdEfgh'

/**
 * 步驟 3：設定訂單相關參數
 * Step 3: Configure order-related parameters
 */
export const DELIVERY_FEE = 50; // 外送費 (如果不需要外送，可以設為 0)

/**
 * 步驟 4：建立您的菜單
 * Step 4: Create your menu
 * 
 * - name: 品項名稱 (必填)
 * - price: 價格 (必填)
 * - icon: 表情符號 (可選)
 * - status: 狀態，例如 '供應中', '本日售完' (必填)
 * - image: 商品圖片網址 (建議使用 https://picsum.photos 或您自己的圖床)
 */
export const MENU_ITEMS: MenuItemType[] = [
    { name: '招牌雞腿飯', price: 120, icon: '🍗', status: '供應中', image: 'https://picsum.photos/seed/chickenleg/400/300' },
    { name: '經典排骨飯', price: 110, icon: '🍖', status: '供應中', image: 'https://picsum.photos/seed/porkchop/400/300' },
    { name: '日式鯖魚飯', price: 130, icon: '🐟', status: '供應中', image: 'https://picsum.photos/seed/fish/400/300' },
    { name: '三杯雞丁飯', price: 125, icon: '🐔', status: '本日售完', image: 'https://picsum.photos/seed/3cupchicken/400/300' },
    { name: '素食鮮菇飯', price: 100, icon: '🍄', status: '供應中', image: 'https://picsum.photos/seed/mushroom/400/300' },
    { name: '燙青菜', price: 40, icon: '🥬', status: '供應中', image: 'https://picsum.photos/seed/vegetable/400/300' },
    { name: '滷蛋', price: 15, icon: '🥚', status: '供應中', image: 'https://picsum.photos/seed/egg/400/300' },
    { name: '貢丸湯', price: 35, icon: '🥣', status: '供應中', image: 'https://picsum.photos/seed/soup/400/300' },
    { name: '古早味紅茶', price: 25, icon: '🥤', status: '供應中', image: 'https://picsum.photos/seed/blacktea/400/300' },
    { name: '無糖綠茶', price: 25, icon: '🍵', status: '供應中', image: 'https://picsum.photos/seed/greentea/400/300' },
];
