import React, {useContext, useRef} from 'react';
import {ArweaveClient, ArweaveGQLClient} from '../../solArWorld/arweave';

// //
// // uncomment for testing
// //
// import {NewTestClient} from "../../arweave/arweave/TestNetClient";

interface ContextType {
    usingArweaveTestNet: boolean;
    arweaveClient: ArweaveClient;
    arweaveGQLClient: ArweaveGQLClient;
}

const Context = React.createContext({} as ContextType);

function ArweaveContext({children}: { children?: React.ReactNode }) {
    //
    // uncomment for permaweb
    //
    const {current: arweaveClient} = useRef(new ArweaveClient());
    const {current: arweaveGQLClient} = useRef(new ArweaveGQLClient());
    const {current: usingArweaveTestNet} = useRef(false);

    // //
    // // uncomment for testing
    // //
    // const [arweaveClient, setArWeaveClient] = useState(new ArweaveClient());
    // const {current: arweaveGQLClient} = useRef(new ArweaveGQLClient('http://localhost:3000/graphql'));
    // const {current: usingArweaveTestNet} = useRef(true);
    // useLayoutEffect(() => {
    //     (async () => {
    //         setArWeaveClient(await NewTestClient());
    //     })();
    // }, [setArWeaveClient])

    return (
        <Context.Provider
            value={{
                usingArweaveTestNet,
                arweaveClient,
                arweaveGQLClient
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useArweaveContext = () => useContext(Context);
export {
    useArweaveContext
};

export default ArweaveContext;