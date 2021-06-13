import React, {useLayoutEffect, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Icon, IconButton,
    makeStyles,
    MenuItem,
    TextField,
    Theme,
    Tooltip,
    Typography
} from "@material-ui/core";
import {AllQuadrantNumbers, QuadrantNo} from "../../../solArWorld/genesisRegion";
import {InfoOutlined, Refresh as ReloadIcon} from '@material-ui/icons'
import {useSnackbar} from "notistack";
import {useSolanaContext} from "../../../context/Solana";
import {
    Context,
    Keypair,
    LAMPORTS_PER_SOL,
    Logs, PublicKey,
    SystemProgram, SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, MintLayout, AccountLayout, Token} from "@solana/spl-token"
import {
    MintParams
} from "../../../solArWorld/solana/smartContracts";
import limestone from 'limestone-api';
import {DateTime} from "luxon";
import cx from 'classnames';

const AssociatedTokenProgramAccPublicKey = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

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
    disabledText: {
        color: theme.palette.text.disabled
    },
    errorText: {
        color: theme.palette.error.main
    },
    successText: {
        color: theme.palette.success.main
    },
    estimatedCostSectionHeadingLayout: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto 1fr',
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
        gridTemplateColumns: '100px 1fr',
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

export type MintLandPiecesParams = {
    quadrantNo: QuadrantNo;
    newNFTOwnerAccPubKey: PublicKey;
    noOfPiecesToMint: number;
}

export function MintNewLandNFTsCard() {
    const classes = useStyles();
    const {
        solanaRPCConnection,
        solanaRPCConnectionInitializing,
        solanaSelectedWallet
    } = useSolanaContext();
    const {enqueueSnackbar} = useSnackbar();
    const [newOwnerAccLamportBalance, setNewOwnerAccLamportBalance] = useState(0);
    const [loadingOwnerAccBalance, setLoadingOwnerAccBalance] = useState(false);
    const [reloadOwnerAccBalanceToggle, setReloadOwnerAccBalanceToggle] = useState(false);
    const [landNFTMetadataAccRentFee, setLandNFTMetadataAccRentFee] = useState(0);
    const [landNFTMintAccRentFee, setLandNFTMintAccRentFee] = useState(0);
    const [landNFTHoldingAccRentFee, setLandNFTHoldingAccRentFee] = useState(0);
    const [networkTransactionFee, setNetworkTransactionFee] = useState(0);
    const [usdTotal, setUSDTotal] = useState('0');
    const [usdSOLPriceData, setUSDSOLPriceData] = useState('0');
    const [feesLoading, setFeesLoading] = useState(false);
    const [mintLandPiecesParams, setMintLandPiecesParams] = useState<MintLandPiecesParams | null>(null);

    // initialise the mint land pieces params on screen load
    useLayoutEffect(() => {
        if (!solanaSelectedWallet) {
            return;
        }

        const initialMintLandPiecesParams: MintLandPiecesParams = {
            quadrantNo: QuadrantNo.One,
            newNFTOwnerAccPubKey: solanaSelectedWallet.publicKey(),
            noOfPiecesToMint: 1
        }

        setMintLandPiecesParams(initialMintLandPiecesParams)
    }, [solanaSelectedWallet])

    // handle updating MintLandPiecesParams
    const handleUpdateMintLandPiecesParams = (field: string) => async (newValue: any) => {
        if (!mintLandPiecesParams) {
            return;
        }

        // do not allow going beyond max no of pieces
        if (field === 'noOfPiecesToMint') {
            if (newValue > 10) {
                return;
            }
        }

        // prepare updated params
        const updatedMintLandPiecesParams: MintLandPiecesParams = {
            ...mintLandPiecesParams,
            [field]: newValue
        };

        return setMintLandPiecesParams(updatedMintLandPiecesParams);
    }

    // update new owner account balance
    useLayoutEffect(() => {
        (async () => {
            if (solanaRPCConnectionInitializing) {
                return;
            }
            if (!solanaRPCConnection) {
                console.error('solana rpc connection is not set')
                return;
            }
            if (!mintLandPiecesParams) {
                return;
            }

            setLoadingOwnerAccBalance(true);
            try {
                setNewOwnerAccLamportBalance(await solanaRPCConnection.getBalance(
                    mintLandPiecesParams.newNFTOwnerAccPubKey,
                ));
            } catch (e) {
                console.error(`error getting account balance: ${e}`)
            }
            setLoadingOwnerAccBalance(false);
        })();
    }, [mintLandPiecesParams, solanaRPCConnection, reloadOwnerAccBalanceToggle, solanaRPCConnectionInitializing])

    // update fees whenever necessary
    useLayoutEffect(() => {
        (async () => {
            if (!mintLandPiecesParams) {
                return;
            }

            if (solanaRPCConnectionInitializing) {
                setLandNFTMetadataAccRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }
            if (!solanaRPCConnection) {
                console.error('solana rpc connection is not set')
                setLandNFTMetadataAccRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }
            if (!mintLandPiecesParams.noOfPiecesToMint) {
                setLandNFTMetadataAccRentFee(0);
                setNetworkTransactionFee(0);
                setUSDTotal('0');
                return;
            }

            setFeesLoading(true);
            try {
                // get current usd sol price
                const updatedUSDSOLPriceData = await limestone.getPrice(symbols.SOL);

                // calculate the minimum balance for fee exception for 1 nft metadata account
                let updatedLandNFTMetaDataAccRentFee = 0;
                let updatedLandNFTMintAccRentFee = 0;
                let updatedLandHoldingAccRentFee = 0;
                await Promise.all([
                    (async () => {
                        updatedLandNFTMetaDataAccRentFee = (await solanaRPCConnection.getMinimumBalanceForRentExemption(
                            MintLayout.span,// FIXME: put correct thing here
                            'singleGossip',
                        )) * mintLandPiecesParams.noOfPiecesToMint;
                    })(),
                    (async () => {
                        updatedLandNFTMintAccRentFee = (await solanaRPCConnection.getMinimumBalanceForRentExemption(
                            MintLayout.span,
                            'singleGossip',
                        )) * mintLandPiecesParams.noOfPiecesToMint;
                    })(),
                    (async () => {
                        updatedLandHoldingAccRentFee = (await solanaRPCConnection.getMinimumBalanceForRentExemption(
                            AccountLayout.span,
                            'singleGossip',
                        )) * mintLandPiecesParams.noOfPiecesToMint;
                    })(),
                ]);

                // get expected fee multiplier at the moment
                const feeMultiplier = (await solanaRPCConnection.getRecentBlockhash('singleGossip'))
                    .feeCalculator
                    .lamportsPerSignature;

                // calculate expected transaction fee
                const updatedNetworkTransactionFee = feeMultiplier * 3; // FIXME: put proper no. of signatures here

                setUSDTotal(((
                    (
                        updatedLandNFTMetaDataAccRentFee + updatedLandNFTMintAccRentFee +
                        updatedLandHoldingAccRentFee + updatedNetworkTransactionFee
                    ) / LAMPORTS_PER_SOL) * updatedUSDSOLPriceData.value).toFixed(5))
                setUSDSOLPriceData(`${
                    updatedUSDSOLPriceData.value
                } [USD / SOL] @ ${
                    DateTime.fromMillis(updatedUSDSOLPriceData.timestamp).toUTC().toFormat('F')
                } UTC`)
                setNetworkTransactionFee(updatedNetworkTransactionFee);
                setLandNFTMetadataAccRentFee(updatedLandNFTMetaDataAccRentFee);
                setLandNFTMintAccRentFee(updatedLandNFTMintAccRentFee);
                setLandNFTHoldingAccRentFee(updatedLandHoldingAccRentFee);
            } catch (e) {
                console.error(`error loading fees: ${e}`)
            }

            setFeesLoading(false);
        })();
    }, [mintLandPiecesParams, solanaRPCConnection, solanaRPCConnectionInitializing]);

    const [mintingInProgress, setMintingInProgress] = useState(false);
    const handleMint = async () => {
        if (!solanaRPCConnection) {
            console.error('solana rpc connection is not set')
            return;
        }
        if (!mintLandPiecesParams) {
            console.error('params are not set');
            return;
        }
        if (!solanaSelectedWallet) {
            console.error('no wallet connected')
            return;
        }
        setMintingInProgress(true);
        try {
            // generate a keypair for a new SPL token mint account
            const nftMintAccKeyPair = Keypair.generate();

            // generate an associated token account for the nft mint for the new owner of this nft
            const newNFTOwnerAccAssociatedTokenAccPublicKey = (await PublicKey.findProgramAddress(
                [
                    mintLandPiecesParams.newNFTOwnerAccPubKey.toBuffer(),
                    TOKEN_PROGRAM_ID.toBuffer(),
                    nftMintAccKeyPair.publicKey.toBuffer(),
                ],
                AssociatedTokenProgramAccPublicKey
            ))[0]

            // get required opening balances for rent exemption for nftMintAcc and nft1stHoldAcc
            const nftMintAccOpeningBal = await solanaRPCConnection.getMinimumBalanceForRentExemption(
                MintLayout.span,
            );

            // prepare instructions
            const instructions: TransactionInstruction[] = [
                //
                // NFT Mint Acc Creation and Initialisation
                //
                // Create the new nft mint account
                SystemProgram.createAccount({
                    fromPubkey: mintLandPiecesParams.newNFTOwnerAccPubKey,
                    newAccountPubkey: nftMintAccKeyPair.publicKey,
                    lamports: nftMintAccOpeningBal,
                    space: MintLayout.span,
                    programId: TOKEN_PROGRAM_ID,
                }),
                // Initialise nft mint account
                Token.createInitMintInstruction(
                    TOKEN_PROGRAM_ID,
                    nftMintAccKeyPair.publicKey,
                    0,
                    mintLandPiecesParams.newNFTOwnerAccPubKey,
                    null,
                ),

                //
                // NFT Holding Acc Creation and Initialisation
                //
                new TransactionInstruction({
                    programId: AssociatedTokenProgramAccPublicKey,
                    keys: [
                        // 1st
                        // Addresses requiring signatures are 1st, and in the following order:
                        //
                        // those that require write access
                        {pubkey: mintLandPiecesParams.newNFTOwnerAccPubKey, isSigner: true, isWritable: true},
                        // those that require read-only access

                        // 2nd
                        // Addresses not requiring signatures are 2nd, and in the following order:
                        //
                        // those that require write access
                        {pubkey: newNFTOwnerAccAssociatedTokenAccPublicKey, isSigner: false, isWritable: true},
                        // those that require read-only access
                        {pubkey: mintLandPiecesParams.newNFTOwnerAccPubKey, isSigner: false, isWritable: false},
                        {pubkey: nftMintAccKeyPair.publicKey, isSigner: false, isWritable: false},
                        {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
                        {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
                        {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
                    ],
                    data: undefined
                }),


                //
                // Mint the Single NFT
                //
                Token.createMintToInstruction(
                    TOKEN_PROGRAM_ID,
                    nftMintAccKeyPair.publicKey,
                    newNFTOwnerAccAssociatedTokenAccPublicKey,
                    mintLandPiecesParams.newNFTOwnerAccPubKey,
                    [],
                    1,
                ),

                //
                // Create and Initialise Metadata Account
                //
            ];

            // prepare transaction to hold nft minting instructions
            let txn = new Transaction();
            txn.recentBlockhash = (
                await solanaRPCConnection.getRecentBlockhash('max')
            ).blockhash;
            txn.feePayer = solanaSelectedWallet.publicKey();

            // add instructions
            instructions.forEach((i) => {
                txn = txn.add(i)
            })

            // sign txn by person who will pay for this and
            // extract the required expected signatures
            // (wild I know - but necessary since signing overwrites :( )
            const feePayerSig = (await solanaSelectedWallet.signTransaction(txn)).signatures[0];

            // sign txn by all accounts being created and get sigs
            txn.sign(
                nftMintAccKeyPair
            )

            // signatures back together again
            txn.signatures = [
                feePayerSig,
                ...txn.signatures.slice(1)
            ]

            // subscribe to logs
            const subNo = solanaRPCConnection.onLogs(
                solanaSelectedWallet.publicKey(),
                (logs: Logs, ctx: Context) => {
                    console.debug(`slot no. ${ctx.slot}`)
                    if (logs.err) {
                        console.error(logs.err.toString())
                    }
                    logs.logs.forEach((l) => console.debug(l));
                }
            )

            // submit txn to network
            const txnSignature = await solanaRPCConnection.sendRawTransaction(txn.serialize());

            // wait for confirmation
            await solanaRPCConnection.confirmTransaction(txnSignature);

            // unsubscribe from logs
            await solanaRPCConnection.removeOnLogsListener(subNo);

            enqueueSnackbar('Land Minted', {variant: 'success'})
        } catch (e) {
            enqueueSnackbar('Error Minting Land', {variant: 'error'})
            console.error(`error minting land: ${e}`)
        }
        setMintingInProgress(false);
    }

    const insufficientBalance = (newOwnerAccLamportBalance < (networkTransactionFee + landNFTMetadataAccRentFee));
    const loading = loadingOwnerAccBalance || mintingInProgress || feesLoading;

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
                                />,
                                mintingInProgress ? <CircularProgress size={20}/> : null,
                            ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                        </Grid>
                        <Grid container>
                            {([
                                <Button
                                    disabled={loading || insufficientBalance}
                                    color={'secondary'}
                                    variant={'contained'}
                                    onClick={handleMint}
                                    children={'Mint'}
                                />
                            ]).map((n, idx) => (<Grid key={idx} item>{n}</Grid>))}
                        </Grid>
                    </div>
                }
            />
            <CardContent>
                {mintLandPiecesParams
                    ? (
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
                                            value={mintLandPiecesParams.quadrantNo}
                                            onChange={(e) => handleUpdateMintLandPiecesParams('quadrantNo')(+e.target.value as QuadrantNo)}
                                            error={mintLandPiecesParams.quadrantNo !== QuadrantNo.One}
                                            helperText={mintLandPiecesParams.quadrantNo !== QuadrantNo.One ? 'Only Quadrant 1 available at this time' : undefined}
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
                                    <Typography
                                        children={solanaSelectedWallet ? solanaSelectedWallet.publicKey().toString() : 'no account available'}
                                    />
                                    <div className={classes.lineItemWithHelpIcon}>
                                        <Typography
                                            variant={'subtitle2'}
                                            className={cx({
                                                [classes.disabledText]: loadingOwnerAccBalance,
                                                [classes.errorText]: insufficientBalance && !loadingOwnerAccBalance,
                                                [classes.successText]: !(insufficientBalance || loadingOwnerAccBalance)
                                            })}
                                            color={(newOwnerAccLamportBalance < (networkTransactionFee + landNFTMetadataAccRentFee)) ? 'error' : undefined}
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
                                        <Typography
                                            variant={'body2'}
                                            className={classes.lineItemHelperText}
                                        >
                                            Maximum amount that can be minted at a time is {10}.
                                        </Typography>
                                    </div>
                                    <div className={classes.noOfPiecesLineItem}>
                                        <TextField
                                            label={'No. of Pieces'}
                                            disabled={mintingInProgress}
                                            inputProps={{type: 'number'}}
                                            onChange={(e) => handleUpdateMintLandPiecesParams('noOfPiecesToMint')(+e.target.value)}
                                            value={mintLandPiecesParams.noOfPiecesToMint}
                                        />
                                        <Typography
                                            variant={'body2'}
                                            children={'Each piece is 10 x 10m'}
                                        />
                                    </div>
                                </>,
                                <>
                                    <div className={classes.estimatedCostSectionHeadingLayout}>
                                        <Typography
                                            variant={'subtitle1'}
                                            children={'4. Estimated Cost:'}
                                        />
                                        <Typography
                                            variant={'subtitle2'}
                                            className={cx({[classes.disabledText]: feesLoading})}
                                            children={`SOL ${((networkTransactionFee + landNFTMetadataAccRentFee) / LAMPORTS_PER_SOL).toFixed(10)}`}
                                        />
                                        <Typography
                                            variant={'subtitle2'}
                                            className={classes.lineItemHelperText}
                                            children={'which is about'}
                                        />
                                        <Typography
                                            variant={'subtitle2'}
                                            className={cx({[classes.disabledText]: feesLoading})}
                                            children={`USD ${usdTotal}`}
                                        />
                                        {usdSOLPriceData
                                            ? (
                                                <Tooltip
                                                    placement={'top'}
                                                    title={usdSOLPriceData}
                                                >
                                                    <Icon className={classes.helpIcon}>
                                                        <InfoOutlined/>
                                                    </Icon>
                                                </Tooltip>
                                            )
                                            : <div/>
                                        }
                                    </div>
                                    <div className={classes.toPayForLineItems}>
                                        {/* ---- Mint Acc ---- */}
                                        <Tooltip
                                            placement={'top'}
                                            title={`${
                                                mintLandPiecesParams.noOfPiecesToMint
                                            } piece @ SOL ${
                                                landNFTMintAccRentFee / (mintLandPiecesParams.noOfPiecesToMint * LAMPORTS_PER_SOL)
                                            } (${MintLayout.span} bytes) each`}
                                        >
                                            <Icon className={classes.helpIcon}>
                                                <InfoOutlined/>
                                            </Icon>
                                        </Tooltip>
                                        <Typography
                                            variant={'body1'}
                                            children={'Land NFT Mint Acc Rent:'}
                                        />
                                        <Typography
                                            variant={'body2'}
                                            className={cx({[classes.disabledText]: feesLoading})}
                                            children={`SOL ${(landNFTMintAccRentFee / LAMPORTS_PER_SOL).toFixed(10)}`}
                                        />

                                        {/* ---- Holding Acc ---- */}
                                        <Tooltip
                                            placement={'top'}
                                            title={`${
                                                mintLandPiecesParams.noOfPiecesToMint
                                            } piece @ SOL ${
                                                landNFTHoldingAccRentFee / (mintLandPiecesParams.noOfPiecesToMint * LAMPORTS_PER_SOL)
                                            } (${AccountLayout.span} bytes) each`}
                                        >
                                            <Icon className={classes.helpIcon}>
                                                <InfoOutlined/>
                                            </Icon>
                                        </Tooltip>
                                        <Typography
                                            variant={'body1'}
                                            children={'Land NFT Holding Acc Rent:'}
                                        />
                                        <Typography
                                            variant={'body2'}
                                            className={cx({[classes.disabledText]: feesLoading})}
                                            children={`SOL ${(landNFTHoldingAccRentFee / LAMPORTS_PER_SOL).toFixed(10)}`}
                                        />

                                        {/* ---- Metadata Acc ---- */}
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
                                            children={'Land NFT Metadata Acc Rent:'}
                                        />
                                        <Typography
                                            variant={'body2'}
                                            className={cx({[classes.disabledText]: feesLoading})}
                                            children={`SOL ${(landNFTMetadataAccRentFee / LAMPORTS_PER_SOL).toFixed(10)}`}
                                        />

                                        {/* ---- Txn Fee ---- */}
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
                                            className={cx({[classes.disabledText]: feesLoading})}
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
                    )
                    : (<div>loading...</div>)
                }
            </CardContent>
        </Card>
    )
}

interface SuccessfulLandPieceMintReport {
    nftMintAcc: PublicKey;
    nft1stHoldingAcc: PublicKey;
    nft1stHoldingAccOwner: PublicKey;
}
