import {PublicKey, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";

export type InitialiseLandPlaneAccountParams = {
    landProgramID: PublicKey;
    ///   0. `[writable]` The Land Plane account to initialize (Owned by Land program)
    landPlaneAccountToInitialise: PublicKey;
}

export type MintLandPiecesParams = {
    landProgramID: PublicKey;
    nftTokenAccOwnerAccPubKey: PublicKey;
}

export const LAND_PLANE_ACC_SIZE = 10

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
                {pubkey: params.landPlaneAccountToInitialise, isSigner: true, isWritable: true},

                // 2nd
                // Addresses not requiring signatures are 2nd, and in the following order:
                //
                // those that require write access
                // those that require read-only access
            ],
            data: Buffer.from(Uint8Array.of(0, ...new BN(0).toArray("le", 8)))
        })
    },
    mintLandPieces(params: MintLandPiecesParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: params.landProgramID,
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