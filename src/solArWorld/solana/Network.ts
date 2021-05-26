export enum Network {
    MainnetBeta = 'Mainnet Beta',
    Testnet = 'Testnet',
    LocalTestnet = 'LocalTestnet',
    Devnet = 'Devnet'
}

export const AllNetworks: Network[] = [
    Network.MainnetBeta,
    Network.Testnet,
    Network.Devnet,
    Network.LocalTestnet,
]

export function networkToRPCURL(n: Network): string {
    switch (n) {
        case Network.MainnetBeta:
            return 'https://api.mainnet-beta.solana.com';

        case Network.Testnet:
            return 'https://api.testnet.solana.com';

        case Network.LocalTestnet:
            return 'http://localhost:8899';

        case Network.Devnet:
            return 'https://api.devnet.solana.com';

        default:
            throw new TypeError(`unexpected stellar network: '${n}'`)
    }
}