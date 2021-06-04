import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import {SolanaNetwork, solanaNetworkToRPCURL} from "../../solArWorld/solana";

import {Connection} from '@solana/web3.js'
import SolanaWallet, {PhantomWallet} from "../../solArWorld/solana/wallet";

interface ContextType {
    solanaWallets: SolanaWallet[];
    solanaSelectedWallet: SolanaWallet | undefined;
    setSelectedSolanaWallet: (provider: string) => void;

    solanaRPCConnectionInitializing: boolean;
    solanaNetwork: SolanaNetwork;
    setSolanaNetwork: (n: SolanaNetwork) => void;
    solanaRPCConnection: Connection | undefined;
}

const Context = React.createContext({} as ContextType);

function SolanaContext({children}: { children?: React.ReactNode }) {
    const {current: solanaWallets} = useRef([
        PhantomWallet
    ]);
    const [solanaSelectedWallet, setSolanaSelectedWallet] = useState<SolanaWallet>(solanaWallets[0]);

    const [solanaRPCConnectionInitializing, setSolanaRPCConnectionInitializing] = useState(false);
    // const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>(SolanaNetwork.MainnetBeta); FIXME: should be mainnet by default
    const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>(SolanaNetwork.LocalTestnet);
    const [solanaRPCConnection, setSolanaRPCConnection] = useState<Connection | undefined>(undefined);
    useLayoutEffect(() => {
        (async () => {
            setSolanaRPCConnectionInitializing(true);
            try {
                // connect and get version
                const rpcURL = solanaNetworkToRPCURL(solanaNetwork);
                const connection = new Connection(solanaNetworkToRPCURL(solanaNetwork), 'confirmed');
                const apiVersion = await connection.getVersion();
                setSolanaRPCConnection(connection);

                console.debug(`Connected to Solana ${solanaNetwork} at\n${rpcURL}\nCoreAPIVer: ${apiVersion["solana-core"]}\nFeatSetVer: ${apiVersion["feature-set"]}`)
            } catch (e) {
                console.error(`error initialising solana client: ${e}`)
            }
            setSolanaRPCConnectionInitializing(false);
        })();
    }, [solanaNetwork])

    return (
        <Context.Provider
            value={{
                setSelectedSolanaWallet: async (provider: string) => {
                    const w = solanaWallets.find((wn) => (wn.metadata().provider === provider))
                    if (!w) {
                        throw new Error(`invalid wallet provider: ${provider}`);
                    }
                    setSolanaSelectedWallet(w);
                },
                solanaWallets,
                solanaSelectedWallet,
                solanaNetwork,
                setSolanaNetwork,
                solanaRPCConnection,
                solanaRPCConnectionInitializing,
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useSolanaContext = () => useContext(Context);
export {
    useSolanaContext
};

export default SolanaContext;