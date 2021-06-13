import {PublicKey} from "@solana/web3.js";

export type CreateMetaDataParams = {
    // nft metadata account
    // i.e. PDA of:
    // ([
    //      Buffer.from('metaData'),
    //      metadataProgramPubKey.toBuffer(),
    //      mintAccountPubKey.toBuffer(),
    //  ], metadataProgramPubKey)
    // Req: [writable]
    newNFTOwnerAccAssociatedTokenAccPublicKey: PublicKey;

    // public key of the mint that is to have metadata associated
    // with it
    // Req: []
    nftMintAccPublicKey: PublicKey;

    // mint authority of nft mint account
    // Req: [signer]
    nftMintAccMintAuthPublicKey: PublicKey;

    // account responsible for paying any rent required
    // during the create meta data execution
    // Req: [signer]
    rentPayerPublicKey: PublicKey;

    // update authority for new metadata
    // Req: [signer]
    nftMetaDataUpdateAuthPublicKey: PublicKey;

    // initial metadata account state
    Data: {};
}