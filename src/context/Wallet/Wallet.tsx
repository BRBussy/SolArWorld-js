import React, {useContext, useLayoutEffect, useState} from 'react';
import Wallet from "../../solArWorld/Wallet";
import {SolanaKey} from "../../solArWorld/solana";
import {Keypair} from "@solana/web3.js";

interface ContextType {
    wallet: Wallet;
    setWallet: (updatedWallet: Wallet) => void;
}

const Context = React.createContext({} as ContextType);

const localStorageWalletDataKey = 'wallet-savedWallet';

function WalletContext({children}: { children?: React.ReactNode }) {
    const [wallet, setWallet] = useState<Wallet>(new Wallet());

    //
    // Load any saved wallet data on first run
    //
    useLayoutEffect(() => {
        // look for saved wallet data in local storage
        const savedWalletJSONString = localStorage.getItem(localStorageWalletDataKey);
        if (!savedWalletJSONString) {
            // if no data is found then do nothing
            return;
        }

        // saved wallet data exists in local storage ---> try to parse the data
        try {
            setWallet(new Wallet(JSON.parse(
                savedWalletJSONString,
                (name, value) => {
                    if (name === 'solanaKeys') {
                        const solanaKeys = value as {
                            description: string,
                            solanaKeyPair: {
                                keypair: {
                                    publicKey: { [key: number]: number },
                                    secretKey: { [key: number]: number },
                                }
                            }
                        }[];
                        return solanaKeys.map((k, idx) => new SolanaKey({
                            description: k.description,
                            solanaKeyPair: Keypair.fromSecretKey(Uint8Array.from(Object.values(k.solanaKeyPair.keypair.secretKey)))
                        }))
                    }
                    return value;
                }
            )))
        } catch (e) {
            // if there was any error during parsing then clear the local storage
            console.error(`error parsing wallet from local storage: ${e.toString()}`);
            localStorage.removeItem(localStorageWalletDataKey);
        }
    }, [])

    // to update the wallet stored in state (and local storage)
    const handleSetWallet = (updatedWallet: Wallet) => {
        localStorage.setItem(localStorageWalletDataKey, JSON.stringify(updatedWallet));
        setWallet(updatedWallet);
    }

    return (
        <Context.Provider
            value={{
                wallet,
                setWallet: handleSetWallet
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useWalletContext = () => useContext(Context);
export {
    useWalletContext
};

export default WalletContext;