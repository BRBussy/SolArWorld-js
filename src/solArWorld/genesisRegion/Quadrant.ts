import {PublicKey} from "@solana/web3.js";

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

export function QuadrantNumberToLandProgramKey(quadrantNumber: QuadrantNo): PublicKey {
    switch (quadrantNumber) {
        case QuadrantNo.One:
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