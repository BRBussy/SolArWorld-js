import {PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";
import {QuadrantNo, quadrantNumberToLandProgramKey} from "../../genesisRegion";

export type InitialiseLandPlaneAccountParams = {
    landProgramID: PublicKey;
    ///   0. `[writable]` The Land Plane account to initialize (Owned by Land program)
    landPlaneAccountToInitialise: PublicKey;
}

export type MintParams = {
    // new land asset account that is the PDA of:
    // ([
    //      'land',
    //      nextXValue,
    //      nextYValue,
    // ], landProgramAccPublicKey)
    // Req: [writable]
    landAssetAccountPublicKey: PublicKey;

    // spl associated token holding acc for nft
    // i.e. PDA of:
    // ([
    //      newNFTOwnerPublicKey, tokenProgramPubKey, nftMintAccountPubKey
    //  ], splAssociatedTokenAccountProgramID)
    // Note: must hold a balance of 1 of this
    // Req: [signer]
    newNFTOwnerAccAssociatedTokenAccPublicKey: PublicKey

    // the person that will own the minted land piece
    // Req: [signer]
    newNFTTokenAccOwnerAccPubKey: PublicKey;

    // spl mint acc for nft
    // Req: []
    nftMintAccPubKey: PublicKey;
}

export const LAND_PLANE_ACC_SIZE = 10

export const MAX_NO_LAND_PIECES = 10

export interface LandProgramSmartContract {
    mint(params: MintParams): TransactionInstruction;
}

export const LandProgram: LandProgramSmartContract = {
    mint(params: MintParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: quadrantNumberToLandProgramKey(params.quadrantNo),
            keys: [
                // 1st
                // Addresses requiring signatures are 1st, and in the following order:
                //
                // those that require write access
                // those that require read-only access
                {pubkey: params.newNFTTokenAccOwnerAccPubKey, isSigner: true, isWritable: false},

                // 2nd
                // Addresses not requiring signatures are 2nd, and in the following order:
                //
                // those that require write access
                // those that require read-only access
            ],
            data: Buffer.from(Uint8Array.of(0, ...new BN(1).toArray("le", 8)))
        })
    }
}