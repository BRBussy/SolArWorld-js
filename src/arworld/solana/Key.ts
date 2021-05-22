import {Keypair} from "@solana/web3.js";

export default class Key {
    public description: string = '';
    public solanaKeyPair: Keypair = Keypair.generate();

    constructor(k?: Key) {
        if (!k) {
            return;
        }
        this.description = k.description;
        this.solanaKeyPair = Keypair.fromSecretKey(k.solanaKeyPair.secretKey);
    }
}