
import { useState, useEffect } from 'react';
import { LIFF_ID } from '../constants';
import { LiffProfile, NotificationType } from '../types';

// Extend the Window interface to include the liff object
declare global {
  interface Window {
    liff: any;
  }
}

export const useLiff = () => {
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [liffStatus, setLiffStatus] = useState('🔄 初始化 LINE 功能中...');
    const [statusType, setStatusType] = useState<NotificationType>('info');

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                await window.liff.init({ liffId: LIFF_ID });
                if (window.liff.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const [userProfile, token] = await Promise.all([
                        window.liff.getProfile(),
                        window.liff.getIDToken()
                    ]);
                    setProfile(userProfile);
                    setIdToken(token);
                    setLiffStatus(`👋 歡迎，${userProfile.displayName}！`);
                    setStatusType('success');
                } else {
                    if (window.liff.isInClient()) {
                        setLiffStatus('未登入 LINE，正在嘗試登入...');
                        window.liff.login();
                    } else {
                        setLiffStatus('請在 LINE App 中開啟以獲得完整功能。');
                        setStatusType('warning');
                    }
                }
            } catch (error) {
                console.warn('LINE 初始化失敗:', error);
                setLiffStatus('⚠️ LINE 功能載入失敗，但您仍可訂餐。');
                setStatusType('warning');
            }
        };
        
        if (window.liff) {
            initializeLiff();
        } else {
            setLiffStatus('⚠️ LINE SDK 載入失敗，但您仍可訂餐。');
            setStatusType('warning');
        }
    }, []);

    return { profile, idToken, isLoggedIn, liffStatus, statusType };
};
