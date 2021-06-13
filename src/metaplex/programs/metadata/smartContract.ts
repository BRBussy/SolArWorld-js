import {PublicKey, TransactionInstruction} from "@solana/web3.js";
import MetaDataAccState from "./MetaDataAccState";

export type CreateMetadataParams = {
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
    nftMetadataUpdateAuthPublicKey: PublicKey;

    // initial metadata account state
    Data: MetaDataAccState;
}

export interface MetadataProgramSmartContract {
    programID: PublicKey;

    createMetadata(params: CreateMetadataParams): TransactionInstruction;
}

export const MetadataProgram: MetadataProgramSmartContract = {
    programID: new PublicKey(''),
    createMetadata(params: CreateMetadataParams): TransactionInstruction {

        return new TransactionInstruction({
            programId: MetadataProgram.programID,
            keys: [],
            data: undefined
        });
    }
};