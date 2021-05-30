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
    newNTFCardLineItem: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
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
                        <Grid container direction={'column'}>
                            {([
                                <Typography
                                    variant={'body2'}
                                    color={'textPrimary'}
                                >
                                    Select the quadrant in which you would like to mint new land.
                                </Typography>
                            ]).map((n, idx) => (
                                <Grid
                                    className={classes.newNTFCardLineItem}
                                    key={idx}
                                    item
                                >{n}</Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}