import {TransactionInterface} from 'arweave/web/lib/transaction';

export interface GetTransactionsRequest {
    transactionIDs?: string[];
    accountOwnerIDs?: string[];
    tags?: { name: string, value: string, OP?: string }[];
    first?: number;
    after?: number;
    sort?: SortOrder;
}

export enum TagOp {
    EQ = 'EQ',
    NEQ = 'NEQ'
}

export enum SortOrder {
    HEIGHT_DESC = 'HEIGHT_DESC',
    HEIGHT_ASC = 'HEIGHT_ASC' // Is this even a thing?
}

interface TransactionsGQLResponse {
    data: { transactions: { edges: { node: TransactionInterface }[] } };
}

export enum GraphQLEndPoint {
    ArweaveDotNet = 'https://arweave.net/graphql',
    GatewayDotAmplifyDotHost = 'https://gateway.amplify.host/graphql'
}

export const AllGraphQLEndPoints: GraphQLEndPoint[] = [
    GraphQLEndPoint.ArweaveDotNet,
    GraphQLEndPoint.GatewayDotAmplifyDotHost
]

export default class GQLClient {
    public arweaveGQLEndpoint: string = 'https://arweave.net/graphql';

    constructor(arweaveGQLEndpoint?: string) {
        if (!arweaveGQLEndpoint) {
            return;
        }
        this.arweaveGQLEndpoint = arweaveGQLEndpoint;
    }

    async getTransactions(request: GetTransactionsRequest): Promise<TransactionInterface[]> {
        let transactionIDs = '';
        if (request.transactionIDs && request.transactionIDs.length) {
            transactionIDs = `ids: [${request.transactionIDs.map((t) => (`"${t}"`)).join(",")}],`
        }

        let accountOwnerIDs = '';
        if (request.accountOwnerIDs && request.accountOwnerIDs.length) {
            accountOwnerIDs = `owners: [${request.accountOwnerIDs.map((t) => (`"${t}"`)).join(",")}],`
        }

        let tags = '';
        if (request.tags && request.tags.length) {
            tags = `tags: [${request.tags.map((kvp) => (`{name: "${kvp.name}", values: ["${kvp.value}"]}`))}],`
        }

        if (!(transactionIDs || accountOwnerIDs || tags)) {
            throw new Error('no query parameters')
        }

        console.debug(`perform query: transactions(${transactionIDs} ${accountOwnerIDs} ${tags}) to ${this.arweaveGQLEndpoint}`)
        const response = await fetch(this.arweaveGQLEndpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
query {
    transactions(${transactionIDs} ${accountOwnerIDs} ${tags}) {
        edges {
            node {
                id
                anchor
                signature
                recipient
                owner {
                    address
                    key
                }
                fee {
                    winston
                    ar
                }
                quantity {
                    winston
                    ar
                }                                
                data {
                    size
                    type
                }         
                tags {
                        name
                        value
                     }
                block {
                    id
                    timestamp
                    height
                    previous
                }
                parent {
                    id
                }                                            
            }
        }
    }
}`,
            }),
        });

        const responseData = (await response.json());

        if (responseData.errors) {
            if (responseData.errors.length) {
                throw new Error(responseData.errors[0].message)
            } else {
                throw new Error(responseData.errors)
            }
        }

        const transactions = (responseData as TransactionsGQLResponse).data.transactions.edges.map((e) => (e.node));

        console.debug('got response: transactions', transactions)

        return transactions;
    }
}