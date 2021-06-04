import React, {useContext, useRef, useState} from 'react';
import Wallet, {PhantomWallet} from "../../solArWorld/solana/wallet";

interface ContextType {
    wallets: Wallet[];
    selectedWallet: Wallet;
}

const Context = React.createContext({} as ContextType);

function WalletContext({children}: { children?: React.ReactNode }) {
    const {current: wallets} = useRef([
        PhantomWallet
    ]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet>(wallets[0]);

    return (
        <Context.Provider
            value={{
                wallets,
                selectedWallet
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