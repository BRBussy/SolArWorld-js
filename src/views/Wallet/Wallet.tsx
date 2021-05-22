import React from 'react';
import {Grid} from "@material-ui/core";
import {ArweaveWalletCard} from "../../components/Arweave";
import {SolanaWalletCard} from "../../components/Solana";

export default function Wallets() {
    return (
        <Grid container style={{margin: 0}}>
            <Grid item>
                <ArweaveWalletCard/>
            </Grid>
            <Grid item>
                <SolanaWalletCard/>
            </Grid>
        </Grid>
    )
}