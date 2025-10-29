import { useState, useEffect } from 'react';
import { LIFF_ID } from '../constants';
import { LiffUserProfile } from '../types';

declare const liff: any;

export const useLiff = () => {
    const [profile, setProfile] = useState<LiffUserProfile | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                await liff.init({ liffId: LIFF_ID });
                if (liff.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const [userProfile, token] = await Promise.all([
                        liff.getProfile(),
                        liff.getIDToken()
                    ]);
                    setProfile(userProfile);
                    setIdToken(token);
                }
            } catch (error) {
                console.warn('LINE 初始化失敗:', error);
            }
        };

        if (typeof liff !== 'undefined') {
            initializeLiff();
        }
    }, []);

    return { profile, idToken, isLoggedIn };
};
