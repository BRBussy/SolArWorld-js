import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DropZrone from "../../components/DropZone";
import {useSnackbar} from "notistack";
import {useWalletContext} from "../../context/Wallet";
import {useArweaveContext} from "../../context/Arweave";
import {JWKInterface} from "arweave/web/lib/wallet";
import {Wallet} from "../../solArWorld";
import {ArweaveKey} from "../../solArWorld/arweave";
import {ArweaveAccountCard} from "../../components/Arweave";
import {
    DeleteOutline as DeleteAccountIcon,
    Opacity as AirDropIcon,
} from '@material-ui/icons';
import {TestNetClient} from "../../solArWorld/arweave/TestNetClient";

const useStyles = makeStyles((theme) => ({
    viewRoot: {
        padding: theme.spacing(2),
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
    const {arweaveClient, usingArweaveTestNet} = useArweaveContext();
    const [apiLoading, setAPILoading] = useState(false);

    return (
        <div className={classes.viewRoot}>
            <Card>
                <CardHeader
                    title={'Arweave Accounts'}
                    titleTypographyProps={{variant: 'h6'}}
                />
                <CardContent classes={{root: classes.cardContent}}>
                    {!!wallet.arweaveKeys.length &&
                    <Grid container>
                        {wallet.arweaveKeys.map((w, idx) => (
                            <Grid item key={idx}>
                                <Card classes={{root: classes.backgroundColor}}>
                                    <CardHeader
                                        disableTypography
                                        title={
                                            <Grid container spacing={1} alignItems={'center'}>
                                                {([
                                                    <Typography
                                                        variant={'subtitle2'}
                                                        children={'Arweave'}
                                                    />,
                                                    <Typography
                                                        variant={'subtitle2'}
                                                        color={'textSecondary'}
                                                        children={w.description ? `- ${w.description}` : ''}
                                                    />,
                                                    usingArweaveTestNet ? (
                                                            <Tooltip
                                                                title={'Air Drop 1000 AR into wallet'}
                                                                placement={'top'}
                                                            >
                                                                <IconButton
                                                                    size={'small'}
                                                                    onClick={async () => {
                                                                        setAPILoading(true);
                                                                        try {
                                                                            const addressToAirdropTo = await arweaveClient.client.wallets.getAddress(w.key);
                                                                            await (arweaveClient as TestNetClient).airDrop({
                                                                                addressToAirDropTo: addressToAirdropTo,
                                                                                dropAmount: '1000000000000'
                                                                            });
                                                                            enqueueSnackbar(
                                                                                "Airdrop Complete",
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
                                        <ArweaveAccountCard
                                            arwaveKey={w}
                                        />
                                        <div className={classes.removeFromWalletIconButtonWrapper}>
                                            <Tooltip
                                                title={'Remove from wallet'}
                                                placement={'top'}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    onClick={() => setWallet(wallet.removeArweaveKeyFromWallet(w.address))}
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
                                    helperTextAbove={'Drag \'n Drop an Arweave Key File here'}
                                    helperTextBelow={'Key file should end with .json'}
                                    onFilesLoaded={async ([keyFile]) => {
                                        if (!keyFile) {
                                            console.error('key file is null')
                                            return;
                                        }

                                        // parse key
                                        let key: JWKInterface;
                                        try {
                                            key = JSON.parse((new TextDecoder('utf-8')).decode(keyFile));
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
                                            // get address associated with this key
                                            const address = await arweaveClient.getAddressFromKey(key);

                                            // ensure that an annotated wallet for this is not
                                            // already in wallet state
                                            if (wallet.arweaveKeys.find((w) => (w.address === address))) {
                                                enqueueSnackbar(
                                                    `Arweave key with address ${address} already loaded`,
                                                    {variant: 'warning'}
                                                );
                                                return;
                                            }

                                            // update wallet with another arweave key
                                            setWallet(new Wallet({
                                                ...wallet,
                                                arweaveKeys: [
                                                    ...wallet.arweaveKeys,
                                                    new ArweaveKey({
                                                        description: '',
                                                        address: address,
                                                        key: key
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