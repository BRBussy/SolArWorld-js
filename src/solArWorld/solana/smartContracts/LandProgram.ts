import {PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";
import {QuadrantNo, quadrantNumberToLandProgramKey} from "../../genesisRegion";

export type InitialiseLandPlaneAccountParams = {
    landProgramID: PublicKey;
    ///   0. `[writable]` The Land Plane account to initialize (Owned by Land program)
    landPlaneAccountToInitialise: PublicKey;
}

export type MintLandPiecesParams = {
    quadrantNo: QuadrantNo;
    nftTokenAccOwnerAccPubKey: PublicKey;
    noOfPiecesToMint: number;
}

export const LAND_PLANE_ACC_SIZE = 10

export const LAND_NFT_DECORATOR_ACC_SIZE = 10

export const MAX_NO_LAND_PIECES = 10

export interface LandProgramSmartContract {
    initialiseLandPlaneAccount(params: InitialiseLandPlaneAccountParams): TransactionInstruction;

    mintLandPieces(params: MintLandPiecesParams): TransactionInstruction;
}

export const LandProgram: LandProgramSmartContract = {
    initialiseLandPlaneAccount(params: InitialiseLandPlaneAccountParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: params.landProgramID,
            keys: [
                // 1st
                // Addresses requiring signatures are 1st, and in the following order:
                //
                // those that require write access
                // those that require read-only access

                // 2nd
                // Addresses not requiring signatures are 2nd, and in the following order:
                //
                // those that require write access
                {pubkey: params.landPlaneAccountToInitialise, isSigner: false, isWritable: true},
                // those that require read-only access
                {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            ],
            data: Buffer.from(Uint8Array.from([0]))
        })
    },
    mintLandPieces(params: MintLandPiecesParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: quadrantNumberToLandProgramKey(params.quadrantNo),
            keys: [
                // 1st
                // Addresses requiring signatures are 1st, and in the following order:
                //
                // those that require write access
                // those that require read-only access
                {pubkey: params.nftTokenAccOwnerAccPubKey, isSigner: true, isWritable: false},

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