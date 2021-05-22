import Arweave from "arweave";
import {JWKInterface} from "arweave/web/lib/wallet";
import Transaction from "arweave/node/lib/transaction";

export interface CreateDataTransactionRequest {
    key: JWKInterface;
    data: Buffer;
}

export interface CreateDataTransactionResponse {
    transaction: Transaction;
}

export interface SignTransactionRequest {
    transaction: Transaction;
    key: JWKInterface;
}

export interface SignTransactionResponse {
    transaction: Transaction;
}

export interface SubmitTransactionRequest {
    transaction: Transaction;
}

export interface SubmitTransactionResponse {
    status: number,
    statusText: string,
    data: any
}

export interface GetTransactionStatusRequest {
    transactionID: string;
}

export interface GetTransactionStatusResponse {
    status: number;
    confirmed?: {
        block_indep_hash: string;
        block_height: number;
        number_of_confirmations: number;
    }
}

export default class Client {
    public client: Arweave = Arweave.init({});

    getAddressFromKey(jwk: JWKInterface): Promise<string> {
        return this.client.wallets.getAddress(jwk)
    }

    getBalanceForAddress(address: string): Promise<string> {
        return this.client.wallets.getBalance(address);
    }

    async createDataTransaction(request: CreateDataTransactionRequest): Promise<CreateDataTransactionResponse> {
        return {transaction: await this.client.createTransaction(request)};
    }

    async signTransaction(request: SignTransactionRequest): Promise<SignTransactionResponse> {
        await this.client.transactions.sign(request.transaction, request.key);
        return {transaction: request.transaction};
    }

    async submitTransaction(request: SubmitTransactionRequest): Promise<SubmitTransactionResponse> {
        return await this.client.transactions.post(request.transaction);
    }

    async getTransactionStatus(request: GetTransactionStatusRequest): Promise<GetTransactionStatusResponse> {
        const response = await this.client.transactions.getStatus(request.transactionID)
        return {
            status: response.status,
            confirmed: response.confirmed
                ? {
                    block_indep_hash: response.confirmed.block_indep_hash,
                    block_height: response.confirmed.block_height,
                    number_of_confirmations: response.confirmed.number_of_confirmations,
                }
                : undefined
        }
    }
}