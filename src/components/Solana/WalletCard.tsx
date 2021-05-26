import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    IconButton, MenuItem, TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DropZrone from "../../components/DropZone";
import {useSnackbar} from "notistack";
import {useWalletContext} from "../../context/Wallet";
import {Wallet} from "../../solArWorld";
import {SolanaAccountCard} from "../../components/Solana";

import {
    DeleteOutline as DeleteAccountIcon,
    Opacity as AirDropIcon,
} from '@material-ui/icons';
import {useSolanaContext} from "../../context/Solana";
import {SolanaNetwork, SolanaKey, AllSolanaNetworks} from "../../solArWorld/solana";
import {Keypair, LAMPORTS_PER_SOL} from "@solana/web3.js";

const useStyles = makeStyles((theme) => ({
    viewRoot: {
        padding: theme.spacing(2),
    },
    headerLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    backgroundColor: {
        backgroundColor: theme.palette.background.default
    },
    cardContent: {
        padding: theme.spacing(2),
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3)
    },
    accountCardWrapperCardContent: {
        display: 'grid',
        columnGap: theme.spacing(1),
        gridTemplateColumns: 'repeat(2, auto)'
    },
    removeFromWalletIconButtonWrapper: {
        paddingTop: theme.spacing(2)
    },
    uploadNewKeyHeading: {
        marginBottom: theme.spacing(1)
    },
}))

const expectedKeyFileType = 'application/json';

export default function WalletCard() {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {wallet, setWallet} = useWalletContext();
    const {solanaRPCConnection, solanaNetwork, setSolanaNetwork} = useSolanaContext();
    const [apiLoading, setAPILoading] = useState(false);

    const usingTestNet = (
        solanaNetwork === SolanaNetwork.Testnet ||
        solanaNetwork === SolanaNetwork.LocalTestnet
    );

    return (
        <div className={classes.viewRoot}>
            <Card>
                <CardHeader
                    disableTypography
                    title={
                        <div className={classes.headerLayout}>
                            <Typography
                                children={'Solana Accounts'}
                                variant={'h6'}
                            />
                            <TextField
                                select
                                label={'Network'}
                                value={solanaNetwork}
                                onChange={(e) => setSolanaNetwork(e.target.value as SolanaNetwork)}
                            >
                                {AllSolanaNetworks.map((n) => (
                                    <MenuItem key={n} value={n}>
                                        {n}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    }
                />
                <CardContent classes={{root: classes.cardContent}}>
                    {!!wallet.solanaKeys.length &&
                    <Grid container>
                        {wallet.solanaKeys.map((solanaKey, idx) => (
                            <Grid item key={idx}>
                                <Card classes={{root: classes.backgroundColor}}>
                                    <CardHeader
                                        disableTypography
                                        title={
                                            <Grid container spacing={1} alignItems={'center'}>
                                                {([
                                                    <Typography
                                                        variant={'subtitle2'}
                                                        children={'Solana'}
                                                    />,
                                                    <Typography
                                                        variant={'subtitle2'}
                                                        color={'textSecondary'}
                                                        children={solanaKey.description ? `- ${solanaKey.description}` : ''}
                                                    />,
                                                    usingTestNet ? (
                                                            <Tooltip
                                                                title={'Air Drop 1000 SOL into wallet'}
                                                                placement={'top'}
                                                            >
                                                                <IconButton
                                                                    size={'small'}
                                                                    onClick={async () => {
                                                                        if (!solanaRPCConnection) {
                                                                            console.error('solana rpc connection not set');
                                                                            return;
                                                                        }
                                                                        setAPILoading(true);
                                                                        try {
                                                                            const signature = await solanaRPCConnection.requestAirdrop(
                                                                                solanaKey.solanaKeyPair.publicKey,
                                                                                LAMPORTS_PER_SOL,
                                                                            );
                                                                            await solanaRPCConnection.confirmTransaction(signature);
                                                                            enqueueSnackbar(
                                                                                `Airdrop to ${solanaKey.solanaKeyPair.publicKey.toString()} Complete`,
                                                                                {variant: 'success'}
                                                                            )
                                                                        } catch (e) {
                                                                            console.error(`error performing airdrop: ${e}`);
                                                                            enqueueSnackbar(
                                                                                `error performing airdrop: ${e}`,
                                                                                {variant: 'error'}
                                                                            )
                                                                        }
                                                                        setAPILoading(false);
                                                                    }}
                                                                >
                                                                    <AirDropIcon/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        )
                                                        : null,
                                                    apiLoading ? <CircularProgress size={30}/> : null,
                                                ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                                            </Grid>
                                        }
                                    />
                                    <CardContent classes={{root: classes.accountCardWrapperCardContent}}>
                                        <SolanaAccountCard
                                            solanaKey={solanaKey}
                                        />
                                        <div className={classes.removeFromWalletIconButtonWrapper}>
                                            <Tooltip
                                                title={'Remove from wallet'}
                                                placement={'top'}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    onClick={() => setWallet(wallet.removeSolanaKeyFromWallet(solanaKey.solanaKeyPair.publicKey.toString()))}
                                                >
                                                    <DeleteAccountIcon/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>}
                    <div>
                        <Typography
                            variant={'body2'}
                            color={'textSecondary'}
                            className={classes.uploadNewKeyHeading}
                        >
                            Upload a new key file to add another one to the wallet.
                        </Typography>
                        <Grid container>
                            {([
                                <DropZrone
                                    fileTypes={[expectedKeyFileType]}
                                    noFiles={1}
                                    helperTextAbove={'Drag \'n Drop a Solana Key File here'}
                                    helperTextBelow={'Key file should end with .json'}
                                    onFilesLoaded={async ([keyFile]) => {
                                        if (!keyFile) {
                                            console.error('key file is null')
                                            return;
                                        }

                                        // parse and construct solana key pair
                                        let newKeypair: Keypair;
                                        try {
                                            newKeypair = Keypair.fromSecretKey(
                                                Uint8Array.from(JSON.parse((new TextDecoder('utf-8')).decode(keyFile)))
                                            );
                                        } catch (e) {
                                            console.error(`error parsing key file: ${e}`);
                                            enqueueSnackbar(
                                                `Error parsing key file: ${e}`,
                                                {variant: 'warning'}
                                            );
                                            return;
                                        }
                                        // set updated wallet
                                        try {
                                            // ensure that an annotated wallet for this is not
                                            // already in wallet state
                                            if (wallet.solanaKeys.find((w) => (w.solanaKeyPair.publicKey.toString() === newKeypair.publicKey.toString()))) {
                                                enqueueSnackbar(
                                                    `Solana key with address ${newKeypair.publicKey.toString()} already loaded`,
                                                    {variant: 'warning'}
                                                );
                                                return;
                                            }

                                            // update wallet with another solana key
                                            setWallet(new Wallet({
                                                ...wallet,
                                                solanaKeys: [
                                                    ...wallet.solanaKeys,
                                                    new SolanaKey({
                                                        description: '',
                                                        solanaKeyPair: newKeypair
                                                    })
                                                ]
                                            } as Wallet))
                                        } catch (e) {
                                            console.error(`error getting wallet address: ${e}`);
                                            enqueueSnackbar(
                                                `Error getting wallet address: ${e}`,
                                                {variant: 'warning'}
                                            );
                                            return;
                                        }
                                    }}
                                />
                            ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                        </Grid>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}