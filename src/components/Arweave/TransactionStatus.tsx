import React, {useEffect, useRef, useState} from 'react';
import {Chip, CircularProgress, IconButton, makeStyles, TextField, Typography} from "@material-ui/core";
import {useArweaveContext} from "../../context/Arweave";
import {Refresh as RefreshIcon} from "@material-ui/icons";
import {useSnackbar} from "notistack";
import {TransactionStatusResponse} from "arweave/node/transactions";

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 500,
        display: 'grid',
        padding: theme.spacing(1),
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`
    },
    errorChip: {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.error.light,
    },
    neutralChip: {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.primary.light,
    },
    warningChip: {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.warning.light,
    },
    successChip: {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.success.light,
    }
}))

export interface TransactionStatusProps {
    transactionID?: string;
}

export default function TransactionStatus(props: TransactionStatusProps) {
    const {arweaveClient} = useArweaveContext();
    const classes = useStyles();
    const [transactionID, setTransactionID] = useState(props.transactionID ? props.transactionID : '')
    const [loading, setLoading] = useState(false);
    const getTxnStatus = useRef<any>(undefined);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [transactionStatusResponse, setTransactionStatusResponse] = useState<TransactionStatusResponse | undefined>(undefined)
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        clearTimeout(getTxnStatus.current);
        if (!transactionID) {
            setTransactionStatusResponse(undefined);
            return;
        }
        setTimeout(async () => {
            setLoading(true);
            try {
                setTransactionStatusResponse(await arweaveClient.client.transactions.getStatus(transactionID))
            } catch (e) {
                console.error(`error getting status: ${e}`)
                enqueueSnackbar(`error getting status: ${e}`, {variant: 'error'})
            }
            setLoading(false);
        }, 800)
    }, [arweaveClient, transactionID, enqueueSnackbar, refreshToggle])

    return (
        <div className={classes.root}>
            <Typography
                variant={'subtitle2'}
                color={'textSecondary'}
                children={'Query Transaction Status'}
            />
            {loading ? <CircularProgress size={20}/> : <div/>}

            <TextField
                label={'Transaction ID'}
                value={transactionID}
                onChange={(e) => setTransactionID(e.target.value)}
            />
            <IconButton
                onClick={() => setRefreshToggle(!refreshToggle)}
                size={'small'}
            >
                <RefreshIcon/>
            </IconButton>

            {transactionStatusResponse &&
            <div>
                <Chip
                    className={(() => {
                        if (!transactionStatusResponse.status) {
                            return undefined;
                        }
                        switch (transactionStatusResponse.status) {
                            case 200:
                                return classes.successChip;

                            case 202:
                                return classes.neutralChip;

                            case 404:
                                return classes.errorChip;

                            case 400:
                                return classes.errorChip;

                            default:
                                return classes.warningChip;
                        }
                    })()}
                    label={`${
                        (() => {
                            if (!transactionStatusResponse.status) {
                                return undefined;
                            }
                            switch (transactionStatusResponse.status) {
                                case 200:
                                    return `${200} OK`;

                                case 202:
                                    return `${202} Pending`;

                                case 404:
                                    return classes.errorChip;

                                case 400:
                                    return classes.errorChip;

                                default:
                                    return classes.warningChip;
                            }
                        })()
                    } ${
                        transactionStatusResponse.confirmed
                            ? `Confirmations: ${transactionStatusResponse.confirmed.number_of_confirmations}`
                            : ''
                    }`}
                />
            </div>}
        </div>
    )
}