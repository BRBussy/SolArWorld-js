import React, {useLayoutEffect, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    Grid, Icon, IconButton,
    makeStyles,
    MenuItem,
    TextField, Theme, Tooltip,
    Typography
} from "@material-ui/core";
import {AllQuadrantNumbers, QuadrantNo} from "../../../solArWorld/genesisRegion";
import {
    InfoOutlined,
    Refresh as ReloadIcon
} from '@material-ui/icons'
import {useWalletContext} from "../../../context/Wallet";
import SolanaKey from "../../../solArWorld/solana/Key";
import {useSnackbar} from "notistack";
import {useSolanaContext} from "../../../context/Solana";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {LAND_NFT_DECORATOR_ACC_SIZE} from "../../../solArWorld/solana/smartContracts";
import limestone from 'limestone-api';
import {PriceData} from "limestone-api/lib/types";

const {symbols} = limestone;

const useStyles = makeStyles((theme: Theme) => ({
    cardRoot: {
        maxWidth: 550
    },
    headerRoot: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    lineItem: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
    },
    lineItemHelperText: {
        color: theme.palette.text.hint
    },
    lineItemHelperTextWarning: {
        color: theme.palette.warning.light
    },
    lineItemWithHelpIcon: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
    toPayForLineItems: {
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
    noOfPiecesLineItem: {
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
    helpIcon: {
        color: theme.palette.text.hint,
        '&:hover': {
            color: theme.palette.text.primary
        },
        cursor: 'pointer'
    },
    linkText: {
        fontWeight: 'bold',
        color: theme.palette.primary.light,
        '&:hover': {
            textDecoration: 'underline'
        },
        cursor: 'pointer'
    },
}))

export function MintNewLandNFTsCard() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const {solanaRPCConnection, solanaContextInitialising} = useSolanaContext();
    const {enqueueSnackbar} = useSnackbar();
    const [quadrantToMintNewLand, setQuadrantToMintNewLand] = useState(QuadrantNo.One);
    const [solanaKeyToPayWith, setSolanaKeyToPayWith] = useState<SolanaKey | null>(null);
    const [noOfPiecesToMint, setNoOfPiecesToMint] = useState(1);

    // on first load use first account
    useLayoutEffect(() => {
        if (wallet.solanaKeys.length) {
            setSolanaKeyToPayWith(wallet.solanaKeys[0]);
        }
    }, [wallet.solanaKeys])

    // load selected account balance each time it changes
    const [newOwnerAccLamportBalance, setNewOwnerAccLamportBalance] = useState(0);
    const [loadingOwnerAccBalance, setLoadingOwnerAccBalance] = useState(false);
    const [reloadOwnerAccBalanceToggle, setReloadOwnerAccBalanceToggle] = useState(false);
    useLayoutEffect(() => {
        (async () => {
            if (solanaContextInitialising) {
                return;
            }
            if (!solanaKeyToPayWith) {
                console.log('solana key to pay with is not set');
                return;
            }
            if (!solanaRPCConnection) {
                console.error('solana rpc connection is not set')
                return;
            }

            setLoadingOwnerAccBalance(true);
            try {
                setNewOwnerAccLamportBalance(await solanaRPCConnection.getBalance(
                    solanaKeyToPayWith.solanaKeyPair.publicKey,
                ));
            } catch (e) {
                console.error(`error getting account balance: ${e}`)
            }
            setLoadingOwnerAccBalance(false);
        })();
    }, [solanaKeyToPayWith, solanaRPCConnection, reloadOwnerAccBalanceToggle, solanaContextInitialising])

    const [landNFTDecoratorAccountRentFee, setLandNFTDecoratorAccountRentFee] = useState(0);
    const [networkTransactionFee, setNetworkTransactionFee] = useState(0);
    const [usdTotal, setUSDTotal] = useState('0');
    const [usdSOLPriceData, setUSDSOLPriceData] = useState<PriceData | null>(null);
    const [feesLoading, setFeesLoading] = useState(false);
    useLayoutEffect(() => {
        (async () => {
            if (solanaContextInitialising) {
                setLandNFTDecoratorAccountRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }
            if (!solanaRPCConnection) {
                console.error('solana rpc connection is not set')
                setLandNFTDecoratorAccountRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }
            if (!noOfPiecesToMint) {
                setLandNFTDecoratorAccountRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }

            setFeesLoading(true);
            try {
                // get current usd sol price
                const updatedUSDSOLPriceData = await limestone.getPrice(symbols.SOL);

                // calculate the minimum balance for fee exception
                const updatedLandDecoratorAccRentFee = await solanaRPCConnection.getMinimumBalanceForRentExemption(
                    LAND_NFT_DECORATOR_ACC_SIZE * noOfPiecesToMint,
                    'singleGossip',
                )

                // get expected fee multiplier at the moment
                const feeMultiplier = (await solanaRPCConnection.getRecentBlockhash('singleGossip'))
                    .feeCalculator
                    .lamportsPerSignature;

                // calculate expected transaction fee
                const transactionFee = feeMultiplier * 3; // FIXME: put proper no. of signatures here

                // calculate total sol price
                const updatedTotalSolPrice = transactionFee + updatedLandDecoratorAccRentFee;

                setUSDTotal((((updatedLandDecoratorAccRentFee + transactionFee) / LAMPORTS_PER_SOL) * updatedUSDSOLPriceData.value).toFixed(5))
                setNetworkTransactionFee(transactionFee);
                setLandNFTDecoratorAccountRentFee(updatedLandDecoratorAccRentFee);
            } catch (e) {
                console.error(`error loading fees: ${e}`)
            }
            setFeesLoading(false);
        })();
    }, [noOfPiecesToMint, solanaRPCConnection, solanaContextInitialising]);

    const loading = loadingOwnerAccBalance;

    return (
        <Card classes={{root: classes.cardRoot}}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.headerRoot}>
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
                <Grid container direction={'column'} spacing={2}>
                    {([
                        <>
                            <div>
                                <Typography variant={'subtitle1'}>
                                    1. Select Quadrant
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                >
                                    Select the quadrant in which you would like to mint new land.
                                </Typography>
                            </div>
                            <div className={classes.lineItemWithHelpIcon}>
                                <TextField
                                    select
                                    label={'Quadrant'}
                                    disabled={loading}
                                    value={quadrantToMintNewLand}
                                    onChange={(e) => setQuadrantToMintNewLand(+e.target.value as QuadrantNo)}
                                >
                                    {AllQuadrantNumbers.map((n) => (
                                        <MenuItem key={n} value={n}>
                                            {`Quadrant ${n}`}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Tooltip
                                    placement={'top'}
                                    title={`Program deployed in account ${1234} manages this quadrant`}
                                >
                                    <Icon className={classes.helpIcon}>
                                        <InfoOutlined/>
                                    </Icon>
                                </Tooltip>
                            </div>
                        </>,
                        <>
                            <div>
                                <Typography variant={'subtitle1'}>
                                    2. Select New Land Owner
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                >
                                    Decide which of your accounts you would like to have own the new land.
                                </Typography>
                            </div>
                            <Typography
                                variant={'body2'}
                                className={classes.lineItemHelperTextWarning}
                            >
                                This account will pay for minting
                            </Typography>
                            {((!!wallet.solanaKeys.length) && (!!solanaKeyToPayWith))
                                ? (
                                    <>
                                        <TextField
                                            select
                                            disabled={loading}
                                            label={'New Land Owner Account'}
                                            value={solanaKeyToPayWith.solanaKeyPair.publicKey.toString()}
                                            onChange={(e) => {
                                                const solKey = wallet.solanaKeys.find((k) => (k.solanaKeyPair.publicKey.toString() === e.target.value))
                                                if (!solKey) {
                                                    console.error(`could not find solana key in wallet with public key: ${e.target.value}`);
                                                    return;
                                                }
                                                setSolanaKeyToPayWith(solKey);
                                            }}
                                        >
                                            {wallet.solanaKeys.map((k, idx) => (
                                                <MenuItem key={idx} value={k.solanaKeyPair.publicKey.toString()}>
                                                    {k.solanaKeyPair.publicKey.toString()}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <div className={classes.lineItemWithHelpIcon}>
                                            <Typography
                                                variant={'subtitle2'}
                                                children={`This account holds SOL ${(newOwnerAccLamportBalance / LAMPORTS_PER_SOL).toFixed(10)}`}
                                            />
                                            <div>
                                                {loadingOwnerAccBalance
                                                    ? (<CircularProgress size={30}/>)
                                                    : (
                                                        <IconButton
                                                            onClick={() => setReloadOwnerAccBalanceToggle(!reloadOwnerAccBalanceToggle)}
                                                            size={'small'}
                                                        >
                                                            <ReloadIcon/>
                                                        </IconButton>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </>
                                )
                                : (
                                    <div>{'no keys available'}</div>
                                )
                            }
                        </>,
                        <>
                            <div>
                                <Typography variant={'subtitle1'}>
                                    3. Number of Pieces
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                >
                                    Decide how many pieces you would like to mint next to each other.
                                </Typography>
                            </div>
                            <div className={classes.noOfPiecesLineItem}>
                                <TextField
                                    label={'No. of Pieces'}
                                    disabled={loading}
                                    inputProps={{type: 'number'}}
                                    value={noOfPiecesToMint}
                                />
                                <Typography
                                    variant={'body2'}
                                    children={'Each piece is 50 x 50m'}
                                />
                            </div>
                        </>,
                        <>
                            <div className={classes.lineItemWithHelpIcon}>
                                <Typography
                                    variant={'subtitle1'}
                                    children={'4. Estimated Cost:'}
                                />
                                <Typography
                                    variant={'subtitle2'}
                                    children={`SOL ${
                                        ((networkTransactionFee + landNFTDecoratorAccountRentFee) / LAMPORTS_PER_SOL).toFixed(10)
                                    } - USD ${1.01}`}
                                />
                            </div>
                            <div className={classes.toPayForLineItems}>
                                <Tooltip
                                    placement={'top'}
                                    title={`You need to pay for this shit`}
                                >
                                    <Icon className={classes.helpIcon}>
                                        <InfoOutlined/>
                                    </Icon>
                                </Tooltip>
                                <Typography
                                    variant={'body1'}
                                    children={'Land NFT Decorator Acc Rent:'}
                                />
                                <Typography
                                    variant={'body2'}
                                    children={`SOL ${(landNFTDecoratorAccountRentFee / LAMPORTS_PER_SOL).toFixed(10)}`}
                                />

                                <Tooltip
                                    placement={'top'}
                                    title={`You need to pay for this shit`}
                                >
                                    <Icon className={classes.helpIcon}>
                                        <InfoOutlined/>
                                    </Icon>
                                </Tooltip>
                                <Typography
                                    variant={'body1'}
                                    children={'Solana Network Transaction Fee:'}
                                />
                                <Typography
                                    variant={'body2'}
                                    children={`SOL ${0.0001}`}
                                />
                            </div>
                            <div className={classes.lineItemWithHelpIcon}>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                    children={'USD Price estimation made possible by'}
                                />
                                <Typography
                                    className={classes.linkText}
                                    variant={'body2'}
                                    onClick={() => window.open(
                                        'https://github.com/limestone-finance/limestone-api',
                                        '_blank'
                                    )}
                                    children={'Limestone Finance'}
                                />
                            </div>
                            <div className={classes.lineItemWithHelpIcon}>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                    children={'Learn more about'}
                                />
                                <Typography
                                    className={classes.linkText}
                                    variant={'body2'}
                                    onClick={() => window.open(
                                        'https://docs.solana.com/transaction_fees',
                                        '_blank'
                                    )}
                                    children={'Solana Transaction Fees'}
                                />
                            </div>
                            <div className={classes.lineItemWithHelpIcon}>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                    children={'Learn more about'}
                                />
                                <Typography
                                    className={classes.linkText}
                                    variant={'body2'}
                                    onClick={() => window.open(
                                        'https://docs.solana.com/storage_rent_economics',
                                        '_blank'
                                    )}
                                    children={'Solana Rent'}
                                />
                            </div>
                        </>
                    ]).map((n, idx) => (
                        <Grid
                            className={classes.lineItem}
                            key={idx}
                            item
                        >{n}</Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}