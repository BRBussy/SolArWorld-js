import React, {useEffect, useLayoutEffect, useState} from 'react';
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
    headerRoot: {
        display: 'grid',
        minWidth: 400,
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
    helpIcon: {
        color: theme.palette.text.hint,
        '&:hover': {
            color: theme.palette.text.primary
        },
        cursor: 'pointer'
    },
}))

export function MintNewLandNFTsCard() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const [quadrantToMintNewLand, setQuadrantToMintNewLand] = useState(QuadrantNo.One);
    const [solanaKeyToPayWith, setSolanaKeyToPayWith] = useState<SolanaKey | null>(null);

    // on first load use first account
    useLayoutEffect(() => {
        if (wallet.solanaKeys.length) {
            setSolanaKeyToPayWith(wallet.solanaKeys[0]);
        }
    }, [wallet.solanaKeys])

    return (
        <Card>
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
                            <Typography
                                variant={'body2'}
                                className={classes.lineItemHelperText}
                            >
                                Select the quadrant in which you would like to mint new land.
                            </Typography>
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
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperText}
                                >
                                    Select which of your accounts you would like to have own the land.
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                    className={classes.lineItemHelperTextWarning}
                                >
                                    This account will pay for minting
                                </Typography>
                            </div>
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