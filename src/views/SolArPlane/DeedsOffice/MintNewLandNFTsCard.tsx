import React, {useLayoutEffect, useState} from 'react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid, Icon,
    makeStyles,
    MenuItem,
    TextField, Theme, Tooltip,
    Typography
} from "@material-ui/core";
import {AllQuadrantNumbers, QuadrantNo} from "../../../solArWorld/genesisRegion";
import {InfoOutlined} from '@material-ui/icons'
import {useWalletContext} from "../../../context/Wallet";
import SolanaKey from "../../../solArWorld/solana/Key";

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
    const [quadrantToMintNewLand, setQuadrantToMintNewLand] = useState(QuadrantNo.One);
    const [solanaKeyToPayWith, setSolanaKeyToPayWith] = useState<SolanaKey | null>(null);
    const [noOfPiecesToMint, setNoOfPiecesToMint] = useState(1);

    // on first load use first account
    useLayoutEffect(() => {
        if (wallet.solanaKeys.length) {
            setSolanaKeyToPayWith(wallet.solanaKeys[0]);
        }
    }, [wallet.solanaKeys])

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
                                NOTE: This account will pay for minting
                            </Typography>
                            {((!!wallet.solanaKeys.length) && (!!solanaKeyToPayWith))
                                ? (
                                    <TextField
                                        select
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
                                    children={`SOL ${0.0001} - USD ${1.01}`}
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
                                    children={`SOL ${0.0001}`}
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
                                    children={'USD Price estimation made possible by:'}
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
