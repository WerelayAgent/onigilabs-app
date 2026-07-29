"use client";

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@robinhoodchain/wallet-adapter-react';
import { WalletAdapterNetwork } from '@robinhoodchain/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@robinhoodchain/wallet-adapter-wallets';
import { WalletModalProvider } from '@robinhoodchain/wallet-adapter-react-ui';
import { clusterApiUrl } from '@robinhoodchain/web3.js';

// Default styles that can be overridden by your app
import '@robinhoodchain/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
