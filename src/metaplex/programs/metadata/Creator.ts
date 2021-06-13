import {PublicKey} from "@solana/web3.js";

export default class Creator {
    address: PublicKey;
    verified: boolean;
    share: number;

    constructor(args: { address: PublicKey; verified: boolean; share: number }) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}