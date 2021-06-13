import {PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";

export type MintParams = {
    // The person that will own the minted land piece.
    // Signature required to prove that the person who
    // owns the NFT token atm. is wanting to try do this
    // mint.
    // Req: [signer]
    newNFTTokenAccOwnerAccPubKey: PublicKey;

    // new land asset account that is the PDA of:
    // ([
    //      'land',
    //      nextXValue,
    //      nextYValue,
    // ], landProgramAccPublicKey)
    // Req: [writable]
    landAssetAccountPublicKey: PublicKey;

    // spl mint acc for nft
    // Req: []
    nftMintAccPubKey: PublicKey;

    // spl associated token holding acc for nft
    // i.e. PDA of:
    // ([
    //      newNFTTokenAccOwnerAccPubKey, tokenProgramPubKey, nftMintAccPubKey
    //  ], splAssociatedTokenAccountProgramID)
    // Note: must hold a balance of 1 of this
    // Req: []
    newNFTOwnerAccAssociatedTokenAccPublicKey: PublicKey

    // public key of the land contract to perform mint with
    // Req: []
    landProgramAccPublicKey: PublicKey;
}

export const LAND_PLANE_ACC_SIZE = 10

export interface LandProgramSmartContract {
    mint(params: MintParams): TransactionInstruction;
}

export const LandProgram: LandProgramSmartContract = {
    mint(params: MintParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: params.landProgramAccPublicKey,
            keys: [
                // 1st
                // Addresses requiring signatures are 1st, and in the following order:
                //
                // those that require write access
                // those that require read-only access
                {pubkey: params.newNFTTokenAccOwnerAccPubKey, isSigner: true, isWritable: false},
                {pubkey: params.newNFTTokenAccOwnerAccPubKey, isSigner: true, isWritable: false},

                // 2nd
                // Addresses not requiring signatures are 2nd, and in the following order:
                //
                // those that require write access
                // those that require read-only access
            ],
            data: Buffer.from(Uint8Array.of(0, ...new BN(0).toArray("le", 8)))
        })
    }
}