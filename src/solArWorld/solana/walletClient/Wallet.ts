import {PublicKey, Transaction} from '@solana/web3.js';

interface Wallet {
    publicKey(): PublicKey;

    isConnected(): boolean;

    autoApprove(): boolean;

    signTransaction(transaction: Transaction): Promise<Transaction>;

    signTransactions(transactions: Transaction[]): Promise<Transaction[]>;

    connect(): Promise<void>;

    disconnect(): Promise<void>;
}

export default Wallet;