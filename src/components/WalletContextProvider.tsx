"use client";

import React, { FC, createContext, useContext, useState, useEffect } from 'react';

interface WalletContextState {
    account: string | null;
    connect: () => void;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextState>({
    account: null,
    connect: () => {},
    disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            }
        };
        checkConnection();
    }, []);

    const connect = async () => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                }
            } catch (err) {
                console.error("Failed to connect wallet", err);
            }
        } else {
            alert("MetaMask or Web3 wallet not found. Please install a compatible wallet.");
        }
    };

    const disconnect = () => {
        setAccount(null);
    };

    return (
        <WalletContext.Provider value={{ account, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};
