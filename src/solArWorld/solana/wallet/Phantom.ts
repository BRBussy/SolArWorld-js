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
export const PhantomWallet = new (class PhantomWallet implements Wallet {
    private _phantomProvider: PhantomProvider | undefined;
    private _connected: boolean = false;

    metadata(): WalletMetadata {
        throw new Error('Method not implemented.');
    }

    autoApprove(): boolean {
        return false;
    }

    async connect(): Promise<void> {
        // if provider is already set && connected then do nothing
        if (this._phantomProvider && this._phantomProvider.isConnected) {
            return;
        }
        // otherwise a connection should be established

        // check to see if phantom wallet provider is available on window object
        let provider: PhantomProvider;
        if ((window as any)?.solana?.isPhantom) {
            provider = (window as any).solana;
        } else {
            throw new Error('phantom wallet provider not available')
        }

        // prepare function to set provider
        const setProvider: (p: PhantomProvider | undefined) => void = (p: PhantomProvider | undefined) => {
            this._phantomProvider = p;
        }

        // return promise to allow calling function to await successful wallet connection
        return new Promise<void>(async function (resolve, reject) {
            // before invoking connect() on the provider hook up callbacks

            // on 'connect' event
            provider.on('connect', ((setProvider: (p: PhantomProvider | undefined) => void) => (() => {
                console.debug('connected to phantom wallet');
                // set the provider
                setProvider(provider);
                // and terminate promise with success
                resolve();
            }))(setProvider));

            // on 'disconnect' event
            // which is unexpected here since it was not the method being invoked
            provider.on('disconnect', ((setProvider: (p: PhantomProvider | undefined) => void) => (() => {
                console.error('unexpected disconnection from phantom wallet');
                // clear the provider
                setProvider(undefined);
            }))(setProvider));

            // invoke the connection
            try {
                await provider.connect();
            } catch (e) {
                // and if any error occurs then terminate promise with error
                console.error(`error connecting to provider: ${e}`)
                reject(new Error(`error connecting to provider: ${e}`))
            }
        });
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
