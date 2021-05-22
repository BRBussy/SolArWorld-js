import React, {useContext, useLayoutEffect, useState} from 'react';
import {SolanaNetwork, solanaNetworkToRPCURL} from "../../solArWorld/solana";

import {Connection} from '@solana/web3.js'

interface ContextType {
    solanaNetwork: SolanaNetwork;
    setSolanaNetwork: (n: SolanaNetwork) => void;
    solanaRPCConnection: Connection | undefined;
}

const Context = React.createContext({} as ContextType);

function SolanaContext({children}: { children?: React.ReactNode }) {

    const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>(SolanaNetwork.MainnetBeta);
    const [solanaRPCConnection, setSolanaRPCConnection] = useState<Connection | undefined>(undefined);
    useLayoutEffect(() => {
        (async () => {
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
        })();
    }, [solanaNetwork])

    return (
        <Context.Provider
            value={{
                solanaNetwork,
                setSolanaNetwork,
                solanaRPCConnection
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