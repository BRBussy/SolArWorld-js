import {PublicKey, Transaction} from '@solana/web3.js';
import Wallet, {WalletMetadata} from ".";

export type PhantomEvent = 'disconnect' | 'connect';
export type PhantomRequestMethod =
    | 'connect'
    | 'disconnect'
    | 'signTransaction'
    | 'signAllTransactions';

interface PhantomProvider {
    publicKey?: PublicKey;
    isConnected?: boolean;
    autoApprove?: boolean;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}

// PhantomWallet Singleton
export const PhantomWallet = new (class implements Wallet {
    private _phantomProvider: PhantomProvider | undefined;
    private _connected: boolean = false;

    metadata(): WalletMetadata {
        throw new Error('Method not implemented.');
    }

    autoApprove(): boolean {
        return false;
    }

    async connect(): Promise<void> {
        // if provider is already set then do nothing
        if (this._phantomProvider) {
            return;
        }

        // check to see if  there is something on the window?
        let provider: PhantomProvider;
        if ((window as any)?.solana?.isPhantom) {
            provider = (window as any).solana;
        } else {
            // window.open('https://phantom.app/', '_blank');
            console.error('error !!!!!!!')
            return;
        }

        provider.on('connect', () => {
            this._phantomProvider = provider;
        });

        if (!provider.isConnected) {
            await provider.connect();
        }

        this._phantomProvider = provider;
    }

    disconnect(): Promise<void> {
        return Promise.resolve(undefined);
    }

    isConnected(): boolean {
        return false;
    }

    publicKey(): PublicKey {
        throw Error('not implemented');
    }

    signTransaction(transaction: Transaction): Promise<Transaction> {
        throw Error('not implemented');
    }

    signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        return Promise.resolve([]);
    }
})();
