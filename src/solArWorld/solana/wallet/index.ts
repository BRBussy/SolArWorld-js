import {PhantomWallet} from "./Phantom";
import {PublicKey, Transaction} from '@solana/web3.js';

export interface WalletMetadata {
    name: string;
    provider: string;
    imageURL: string;
}

interface Wallet {
    metadata(): WalletMetadata;

    publicKey(): PublicKey;

    isConnected(): boolean;

    autoApprove(): boolean;

    signTransaction(transaction: Transaction): Promise<Transaction>;

    signTransactions(transactions: Transaction[]): Promise<Transaction[]>;

    connect(): Promise<void>;

    disconnect(): Promise<void>;
}

export default Wallet;

export {
    PhantomWallet
}