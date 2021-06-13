import {PublicKey} from "@solana/web3.js";
import Data from "./Data";

export enum MetadataKey {
    Uninitialized = 0,
    MetadataV1 = 4,
    EditionV1 = 1,
    MasterEditionV1 = 2,
    ReservationListV1 = 3,
}

export default class MetaDataAccState {
    public key: MetadataKey = MetadataKey.Uninitialized;
    public updateAuthority: PublicKey = PublicKey.default;
    public mint: PublicKey = PublicKey.default;
    public data: Data = new Data();
    public primarySaleHappened: boolean = false;
    public isMutable: boolean = true;
}