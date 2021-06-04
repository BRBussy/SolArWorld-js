import {PublicKey, Transaction} from '@solana/web3.js';
import Wallet from "./Wallet";

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

export class PhantomWallet implements Wallet {
    private _phantomProvider: PhantomProvider | undefined;
    private _connected: boolean = false;

    autoApprove(): boolean {
        return false;
    }

    connect(): Promise<void> {
        return Promise.resolve(undefined);
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
}
