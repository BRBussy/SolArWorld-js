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
    private _publicKey: PublicKey | undefined;

    metadata(): WalletMetadata {
        return {
            provider: "Phantom",
            iconURL: "https://www.phantom.app/img/logo.png",
            websiteURL: "https://www.phantom.app",
        };
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

        // prepare function to set this._provider
        const setProvider: (p: PhantomProvider | undefined) => void = (p: PhantomProvider | undefined) => {
            this._phantomProvider = p;
        }

        // prepare function to set this._isConnected
        const setIsConnected: (v: boolean) => void = (v: boolean) => {
            this._connected = v;
        }

        // prepare function to set this._publicKey
        const setPublicKey: (p: PublicKey | undefined) => void = (p: PublicKey | undefined) => {
            this._publicKey = p;
        }


        // return promise to allow calling function to await successful wallet connection
        return new Promise<void>(async function (resolve, reject) {
            // before invoking connect() on the provider hook up callbacks

            // on 'connect' event
            provider.on('connect', () => {
                console.debug('connected to phantom wallet');

                // confirm public key is available
                if (!provider.publicKey) {
                    reject(new Error('public key not available on provider'));
                    setPublicKey(undefined);
                    setIsConnected(false);
                    setProvider(undefined);
                    return;
                }

                // indicate that wallet is connected and set the provider
                setPublicKey(provider.publicKey);
                setIsConnected(true);
                setProvider(provider);

                // and terminate promise with success
                resolve();
            });

            // on 'disconnect' event
            // which is unexpected here since it was not the method being invoked
            provider.on('disconnect', () => {
                console.error('unexpected disconnection from phantom wallet');

                // indicate that wallet is not connected and clear the provider
                setPublicKey(undefined);
                setIsConnected(false);
                setProvider(undefined);
            });

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
        return this._connected;
    }

    publicKey(): PublicKey {
        if (!this._publicKey) {
            throw new Error('public key not set');
        }
        return this._publicKey;
    }

    signTransaction(transaction: Transaction): Promise<Transaction> {
        if (!this._phantomProvider) {
            throw new Error('provider not set')
        }
        return this._phantomProvider.signTransaction(transaction);
    }

    signTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        if (!this._phantomProvider) {
            throw new Error('provider not set')
        }
        return this._phantomProvider.signAllTransactions(transactions);
    }
})();
