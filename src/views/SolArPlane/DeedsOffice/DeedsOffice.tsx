import React, {useState} from "react";
import {
    Button,
    Card, CardContent, Grid,
    CardHeader,
    makeStyles, TextField, Typography,
} from "@material-ui/core";
import {useSolanaContext} from "../../../context/Solana";
import {
    SystemInstruction,
    SystemProgram,
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    Logs, Context
} from "@solana/web3.js";
import {useWalletContext} from "../../../context/Wallet";
import {LAND_PLANE_ACC_SIZE, LandProgram} from "../../../solArWorld/solana/smartContracts";

const useStyles = makeStyles((theme) => ({
    newNFTCardHeaderRoot: {
        display: 'grid',
        minWidth: 400,
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    field: {
        minWidth: 500
    }
}))

export default function DeedsOffice() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const {solanaRPCConnection} = useSolanaContext();
    const [apiLoading, setAPILoading] = useState(false);
    const [landProgramID, setLandProgramID] = useState('3PUZ7N2hA4ftZ2W68e6WdEjJJH8FMMhijKFNJWyEtgyA');
    const [newLandPlaneAccountKP, setNewLandPlaneAccountKP] = useState<Keypair | null>(null);

    return (
        <Grid container>
            <Grid item>
                <Card>
                    <CardHeader
                        disableTypography
                        title={
                            <div className={classes.newNFTCardHeaderRoot}>
                                <Grid container>
                                    {([
                                        <Typography
                                            variant={'h5'}
                                            children={'Mint New Land NFTs'}
                                        />
                                    ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                                </Grid>
                                <Grid container>
                                    {([
                                        <Button
                                            color={'secondary'}
                                            variant={'contained'}
                                            children={'Mint'}
                                        />
                                    ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                                </Grid>
                            </div>
                        }
                    />
                    <CardContent>
                        asdf
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}