import {ArweaveKey} from './arweave';
import {SolanaKey} from './solana';

export default class Wallet {
    public arweaveKeys: ArweaveKey[] = [];
    public solanaKeys: SolanaKey[] = [];

    constructor(wallet?: Wallet) {
        if (!wallet) {
            return;
        }
        this.arweaveKeys = wallet.arweaveKeys.map((k) => new ArweaveKey(k));
        this.solanaKeys = wallet.solanaKeys.map((k) => new SolanaKey(k));
    }

    removeArweaveKeyFromWallet(address: string): Wallet {
        return new Wallet({
            ...this,
            arweaveKeys: this.arweaveKeys.filter((k) => (k.address !== address))
        })
    }

    removeSolanaKeyFromWallet(publicKey: string): Wallet {
        return new Wallet({
            ...this,
            solanaKeys: this.solanaKeys.filter((k) => (k.solanaKeyPair.publicKey.toString() !== publicKey))
        })
    }
}