import {PublicKey, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";

export type MintPositiveLandPiecesParams = {
    landProgramID: PublicKey;
}

export interface LandProgramSmartContract {
    mintPositiveLandPieces(params: MintPositiveLandPiecesParams): TransactionInstruction;
}

export const LandProgram: LandProgramSmartContract = {
    mintPositiveLandPieces(params: MintPositiveLandPiecesParams): TransactionInstruction {
        return new TransactionInstruction({
            programId: params.landProgramID,
            keys: [
                // { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
                // { pubkey: tempTokenAccount.publicKey, isSigner: false, isWritable: true },
                // { pubkey: new PublicKey(initializerReceivingTokenAccountPubkeyString), isSigner: false, isWritable: false },
                // { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
                // { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
                // { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            ],
            data: Buffer.from(Uint8Array.of(0, ...new BN(1).toArray("le", 8)))
        })
    }
}