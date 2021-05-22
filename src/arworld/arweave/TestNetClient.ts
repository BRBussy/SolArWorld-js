import Arweave from "arweave";
import Client, {SubmitTransactionRequest, SubmitTransactionResponse} from "./Client";
import TestWeave from 'testweave-sdk';

// init test arweave client
const testArweaveClient = Arweave.init({
    host: 'localhost',
    port: 1984,
    protocol: 'http',
    timeout: 20000,
    logging: false,
});

export interface DropRequest {
    addressToAirDropTo: string;
    dropAmount: string;
}

export interface DropResponse {
    someResponse: string;
}

export interface MineRequest {
}

export interface MineResponse {
    response: string[]
}

export class TestNetClient extends Client {
    public testWeaveHandle: TestWeave | undefined;

    async airDrop(request: DropRequest): Promise<DropResponse> {
        if (!this.testWeaveHandle) {
            console.error('testWeaveHandle is not set')
            throw new Error('testWeaveHandle is not set')
        }

        return {
            someResponse: await this.testWeaveHandle.drop(request.addressToAirDropTo, request.dropAmount)
        }
    }

    async mine(request: MineRequest): Promise<MineResponse> {
        if (!this.testWeaveHandle) {
            console.error('testWeaveHandle is not set')
            throw new Error('testWeaveHandle is not set')
        }
        return {
            response: await this.testWeaveHandle.mine()
        }
    }

    async submitTransaction(request: SubmitTransactionRequest): Promise<SubmitTransactionResponse> {
        const response = await super.submitTransaction(request)
        await this.mine({});
        await this.mine({});
        return response;
    }
}

export const NewTestClient = async () => {
    // prepare a client
    const ntc = new TestNetClient();
    ntc.client = testArweaveClient

    try {
        ntc.testWeaveHandle = await TestWeave.init(ntc.client);
    } catch (e) {
        console.error(`error initialising test client: ${e}`)
        throw Error(`error initialising test client: ${e}`)
    }

    return ntc;
}