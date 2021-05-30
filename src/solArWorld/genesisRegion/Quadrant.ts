import {PublicKey} from "@solana/web3.js";
import {QUAD1_LAND_PROGRAM_PUBLIC_KEY} from "./LandProgram";

export const QuadrantTypeName = 'solArWorld/genesisRegion/Quadrant';

export enum QuadrantNo {
    One = 1, Two, Three, Four
}

export const AllQuadrantNumbers: QuadrantNo[] = [
    QuadrantNo.One,
    QuadrantNo.Two,
    QuadrantNo.Three,
    QuadrantNo.Four
]

export function quadrantNumberToLandProgramKey(quadrantNumber: QuadrantNo): PublicKey {
    switch (quadrantNumber) {
        case QuadrantNo.One:
            return QUAD1_LAND_PROGRAM_PUBLIC_KEY;

        case QuadrantNo.Two:
        case QuadrantNo.Three:
        case QuadrantNo.Four:
        default:
            throw new TypeError(`invalid quadrant number ${quadrantNumber}`);
    }
}

export class Quadrant {
    ['@type']: string = QuadrantTypeName;
    public quadrantNo: QuadrantNo = -1;
}