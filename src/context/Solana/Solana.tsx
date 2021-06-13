import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import {SolanaNetwork, solanaNetworkToRPCURL} from "../../solArWorld/solana";

import {Connection} from '@solana/web3.js'
import SolanaWallet, {PhantomWallet} from "../../solArWorld/solana/wallet";
import {ListItemIcon, Menu, MenuItem, Typography} from "@material-ui/core";
import {AccountBalanceWallet as WalletIcon} from '@material-ui/icons'

interface ContextType {
    solanaWalletInitialising: boolean;
    solanaWallets: SolanaWallet[];
    solanaSelectedWallet: SolanaWallet | undefined;
    setSelectedSolanaWallet: (provider: string) => void;
    showSolanaWalletSelector: (anchorEl: HTMLElement) => void;
    hideSolanaWalletSelector: () => void;

    solanaRPCConnectionInitializing: boolean;
    solanaNetwork: SolanaNetwork;
    setSolanaNetwork: (n: SolanaNetwork) => void;
    solanaRPCConnection: Connection | undefined;
}

const Context = React.createContext({} as ContextType);

function SolanaContext({children}: { children?: React.ReactNode }) {
    const [solanaWalletInitialising, setSolanaWalletInitialising] = useState(false);
    const {current: solanaWallets} = useRef([
        PhantomWallet
    ]);
    const [solanaSelectedWallet, setSolanaSelectedWallet] = useState<SolanaWallet | undefined>(undefined);
    useLayoutEffect(() => {
        (async () => {
            try {
                setSolanaWalletInitialising(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                const firstWallet = solanaWallets[0];
                await firstWallet.connect();
                setSolanaSelectedWallet(firstWallet);
                setSolanaWalletInitialising(false);
            } catch (e) {
                console.error(`error initialising connection to wallet: ${e}`)
            }
        })();
    }, [solanaWallets]);

    const [solanaRPCConnectionInitializing, setSolanaRPCConnectionInitializing] = useState(false);
    // const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>(SolanaNetwork.MainnetBeta); FIXME: should be mainnet by default
    const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>(SolanaNetwork.Devnet);
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

    const [walletSelectorAnchorEl, setWalletSelectorAnchorEl] = useState<null | HTMLElement>(null);
    const showSolanaWalletSelector = (anchorEl: HTMLElement) => {
        setWalletSelectorAnchorEl(anchorEl);
    }
    const hideSolanaWalletSelector = () => {
        setWalletSelectorAnchorEl(null);
    }

    return (
        <Context.Provider
            value={{
                solanaWalletInitialising,
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
                showSolanaWalletSelector,
                hideSolanaWalletSelector,

                solanaRPCConnectionInitializing,
                setSolanaNetwork,
                solanaRPCConnection,
            }}
        >
            {children}

            <Menu
                anchorEl={walletSelectorAnchorEl}
                keepMounted
                open={Boolean(walletSelectorAnchorEl)}
                onClose={hideSolanaWalletSelector}
                onClick={hideSolanaWalletSelector}
            >
                <MenuItem>
                    <ListItemIcon>
                        <WalletIcon/>
                    </ListItemIcon>
                    <Typography>Phantom</Typography>
                </MenuItem>
            </Menu>
        </Context.Provider>
    )
}

const useSolanaContext = () => useContext(Context);
export {
    useSolanaContext
};

export default SolanaContext;