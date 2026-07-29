"use client";

import { useWallet } from './WalletContextProvider';

export default function ConnectWalletButton() {
    const { account, connect, disconnect } = useWallet();

    if (account) {
        return (
            <button 
                onClick={disconnect}
                className="bg-card border border-border text-foreground hover:bg-card/80 px-4 py-2 rounded-lg font-mono text-sm transition-colors"
            >
                {account.slice(0, 6)}...{account.slice(-4)}
            </button>
        );
    }

    return (
        <button 
            onClick={connect}
            className="bg-signal text-signal-foreground hover:bg-signal/90 px-4 py-2 rounded-lg font-mono text-sm transition-colors"
        >
            Connect EVM
        </button>
    );
}
