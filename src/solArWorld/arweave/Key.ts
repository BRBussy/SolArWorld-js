import {JWKInterface} from "arweave/web/lib/wallet";

export default class Key {
    public description: string = '';
    public address: string = '';
    public key: JWKInterface = {e: "", kty: "", n: ""};

    constructor(arweaveKey?: Key) {
        if (!arweaveKey) {
            return;
        }
        this.description = arweaveKey.description;
        this.address = arweaveKey.address;
        this.key = {...arweaveKey.key};
    }
}