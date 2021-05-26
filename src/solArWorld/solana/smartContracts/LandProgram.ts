import {TransactionInstruction, TransactionInstructionCtorFields} from "@solana/web3.js";

export type MintPositiveLandPiecesParams = TransactionInstructionCtorFields

export interface LandProgramSmartContract {
    mintPositiveLandPieces(params: MintPositiveLandPiecesParams): TransactionInstruction;
}

export const LandProgram: LandProgramSmartContract = {
    mintPositiveLandPieces(params: MintPositiveLandPiecesParams): TransactionInstruction {
        return new TransactionInstruction(params)
    }
}