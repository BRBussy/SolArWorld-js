import {PhantomWallet} from "./Phantom";
import {PublicKey, Transaction} from '@solana/web3.js';

export interface WalletMetadata {
    provider: string;
    iconURL: string;
    websiteURL: string;
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