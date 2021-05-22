import React, {useState} from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    Grid, IconButton, InputAdornment,
    makeStyles, Menu, MenuItem,
    TextareaAutosize,
    TextField, Tooltip,
    Typography
} from "@material-ui/core";
import cx from "classnames";
import {
    AccountBalanceWallet as WalletIcon,
    AddCircleOutlined as AddIcon,
    RemoveCircleOutlined as RemoveIcon,
    ExpandMore as MenuIcon,
} from "@material-ui/icons";
import {useArweaveContext} from "../../../context/Arweave";
import {SolArWorldScrollClassName, commonTagNameValues, commonTagValueValues} from "../../../common";
import Popover from "../../../components/PopOver/Popover";
import {useSnackbar} from "notistack";
import TransactionStatus from "../../../components/Arweave/TransactionStatus";
import {useWalletContext} from "../../../context/Wallet";

const useStyles = makeStyles((theme) => ({
    border: {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`
    },
    transactionDataTextArea: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(.5, 1),
        fontSize: 16,
        backgroundColor: theme.palette.background.paper,
        width: 'calc(100vw/1.5)',
        borderRadius: 4,
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
        resize: 'none'
    },
    transactionDataFieldLayout: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(1),
        gridRowGap: theme.spacing(.5)
    },
    transactionDataFieldError: {
        border: `1px solid ${theme.palette.error.main}`
    },
    kvWrapper: {
        maxHeight: 200,
        overflowY: 'scroll',
    },
    kvLineItem: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto) 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(.5)
    }
}))

export default function Upload() {
    const classes = useStyles();
    const {arweaveClient} = useArweaveContext();
    const {wallet} = useWalletContext();
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<string[]>([]);

    //
    // key, value pair filter
    //
    const [keyValuePairs, setKeyValuePairs] = useState<{ name: string, value: string }[]>([]);

    //
    // responsible fee account
    //
    const [accountID, setAccountID] = useState('');
    const [anchorElAccountMenu, setAnchorElAccountMenu] = React.useState<null | HTMLElement>(null);
    const handleCloseAccountMenu = () => {
        setAnchorElAccountMenu(null);
    };
    const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElAccountMenu(event.currentTarget);
    };

    const [dataToPersist, setDataToPersist] = useState('');

    const handleSubmit = async () => {
        const key = wallet.arweaveKeys.find((k) => (k.address === accountID));
        if (!key) {
            console.error('could not find key')
            return;
        }

        setLoading(true);
        try {
            // construct a data transaction
            const createDataTransactionResponse = await arweaveClient.createDataTransaction({
                key: key.key,
                data: Buffer.from(dataToPersist, 'utf8')
            })

            // add any tags
            keyValuePairs.forEach((kvp) =>
                createDataTransactionResponse.transaction.addTag(kvp.name, kvp.value)
            )

            // sign it
            const signTransactionResponse = await arweaveClient.signTransaction({
                key: key.key,
                transaction: createDataTransactionResponse.transaction
            })

            // submit it
            const submitTransactionResponse = await arweaveClient.submitTransaction({
                transaction: signTransactionResponse.transaction,
            })

            setFeedback([
                `transactionID: ${signTransactionResponse.transaction.id}`,
                `submission status: ${submitTransactionResponse.status} - ${submitTransactionResponse.statusText}`,
            ])
            enqueueSnackbar('Transaction Submitted', {variant: 'success'})
        } catch (e) {
            console.error(`error submitting transaction: ${e}`);
            enqueueSnackbar(`error submitting transaction: ${e}`, {variant: 'error'})
        }
        setLoading(false);
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item>
                    <Card>
                        <CardHeader
                            titleTypographyProps={{variant: 'subtitle1'}}
                            title={'Perma-Persist some data'}
                        />
                        <CardContent>
                            <Grid container direction={'column'} spacing={2}>
                                {([
                                    <Grid container direction={'row'} alignItems={'center'} spacing={1}>
                                        {([
                                            <TextField
                                                label={'Transaction Account'}
                                                onChange={(e) => setAccountID(e.target.value)}
                                                value={accountID}
                                            />,

                                            <>
                                                <Tooltip
                                                    placement={'top'}
                                                    title={wallet.arweaveKeys.length
                                                        ? 'Select an account from the in app wallet to pay for transaction'
                                                        : 'If any arweave keys are added to the in app wallet, the associated account addresses will show up here for selection'
                                                    }
                                                >
                                                    <IconButton
                                                        size={'small'}
                                                        onClick={handleOpenAccountMenu}
                                                    >
                                                        <WalletIcon/>
                                                    </IconButton>
                                                </Tooltip>
                                                {/* Account Menu */}
                                                <Menu
                                                    anchorEl={anchorElAccountMenu}
                                                    keepMounted
                                                    open={Boolean(anchorElAccountMenu)}
                                                    onClose={handleCloseAccountMenu}
                                                >
                                                    {wallet.arweaveKeys.map((k) => (
                                                        <MenuItem
                                                            key={k.address}
                                                            onClick={() => {
                                                                handleCloseAccountMenu();
                                                                setAccountID(k.address);
                                                            }}
                                                        >
                                                            {k.address}
                                                        </MenuItem>
                                                    ))}
                                                </Menu>
                                            </>,

                                            <Button
                                                variant={'contained'}
                                                children={'Submit'}
                                                onClick={handleSubmit}
                                            />,
                                            feedback.length
                                                ? (
                                                    <ul>
                                                        {feedback.map((f, idx) => (<li key={idx}>{f}</li>))}
                                                    </ul>
                                                )
                                                : null,

                                            loading ? <CircularProgress size={30}/> : null,
                                        ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                                    </Grid>,
                                    <Grid container>
                                        <Grid item>
                                            <div className={cx(classes.border)}>
                                                <Typography
                                                    variant={'body2'}
                                                    color={'textSecondary'}
                                                    children={'Add Name-Value Pairs (e.g. Content-Type - text/html)'}
                                                />
                                                <div className={cx(classes.kvWrapper, SolArWorldScrollClassName)}>
                                                    {keyValuePairs.length
                                                        ? keyValuePairs.map((kvPair, idx) => (
                                                            <div className={classes.kvLineItem} key={idx}>
                                                                <TextField
                                                                    label={'Name'}
                                                                    value={kvPair.name}
                                                                    onChange={(e) => {
                                                                        keyValuePairs[idx].name = e.target.value;
                                                                        setKeyValuePairs([...keyValuePairs]);
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <Popover
                                                                                anchorOrigin={{
                                                                                    horizontal: -100,
                                                                                    vertical: 19
                                                                                }}
                                                                                popOverComponent={
                                                                                    <Card>
                                                                                        {commonTagNameValues.map((n, nIdx) => (
                                                                                            <MenuItem
                                                                                                key={nIdx}
                                                                                                onClick={() => setKeyValuePairs((prevKeyPairs) => {
                                                                                                    prevKeyPairs[idx] = {
                                                                                                        name: n,
                                                                                                        value: prevKeyPairs[idx].value
                                                                                                    }
                                                                                                    return [...prevKeyPairs]
                                                                                                })}
                                                                                            >
                                                                                                {n}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Card>
                                                                                }
                                                                            >
                                                                                <InputAdornment position={'end'}>
                                                                                    <Tooltip
                                                                                        title={'Common Name Values'}
                                                                                        placement={'top'}>
                                                                                        <IconButton size={'small'}>
                                                                                            {<MenuIcon/>}
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </InputAdornment>
                                                                            </Popover>
                                                                        )
                                                                    }}
                                                                />
                                                                <TextField
                                                                    label={'Value'}
                                                                    value={kvPair.value}
                                                                    onChange={(e) => {
                                                                        keyValuePairs[idx].value = e.target.value;
                                                                        setKeyValuePairs([...keyValuePairs]);
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <Popover
                                                                                anchorOrigin={{
                                                                                    horizontal: -100,
                                                                                    vertical: 19
                                                                                }}
                                                                                popOverComponent={
                                                                                    <Card>
                                                                                        {commonTagValueValues.map((value, nIdx) => (
                                                                                            <MenuItem
                                                                                                key={nIdx}
                                                                                                onClick={() => setKeyValuePairs((prevKeyPairs) => {
                                                                                                    prevKeyPairs[idx] = {
                                                                                                        name: prevKeyPairs[idx].name,
                                                                                                        value: value
                                                                                                    }
                                                                                                    return [...prevKeyPairs]
                                                                                                })}
                                                                                            >
                                                                                                {value}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Card>
                                                                                }
                                                                            >
                                                                                <InputAdornment position={'end'}>
                                                                                    <Tooltip
                                                                                        title={'Common Values'}
                                                                                        placement={'top'}>
                                                                                        <IconButton size={'small'}>
                                                                                            {<MenuIcon/>}
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </InputAdornment>
                                                                            </Popover>
                                                                        )
                                                                    }}
                                                                />
                                                                <IconButton
                                                                    size={'small'}
                                                                    onClick={() => {
                                                                        const updated: { name: string, value: string }[] = [];
                                                                        keyValuePairs.forEach((kvp, kvpIdx) => {
                                                                            updated.push(kvp)
                                                                            if (idx === kvpIdx) {
                                                                                updated.push({name: '', value: ''})
                                                                            }
                                                                        })
                                                                        setKeyValuePairs(updated);
                                                                    }}
                                                                >
                                                                    <AddIcon/>
                                                                </IconButton>
                                                                <IconButton
                                                                    size={'small'}
                                                                    onClick={() => setKeyValuePairs(keyValuePairs.filter((kvp, kvpIdx) => (kvpIdx !== idx)))}
                                                                >
                                                                    <RemoveIcon/>
                                                                </IconButton>
                                                            </div>
                                                        ))
                                                        : (
                                                            <div className={classes.kvLineItem}>
                                                                <TextField
                                                                    label={'Name'}
                                                                    onChange={(e) => {
                                                                        setKeyValuePairs([{
                                                                            name: e.target.value,
                                                                            value: '',
                                                                        }]);
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <Popover
                                                                                anchorOrigin={{
                                                                                    horizontal: -100,
                                                                                    vertical: 19
                                                                                }}
                                                                                popOverComponent={
                                                                                    <Card>
                                                                                        {commonTagNameValues.map((k, idx) => (
                                                                                            <MenuItem
                                                                                                key={idx}
                                                                                                onClick={() => setKeyValuePairs([{
                                                                                                    name: k,
                                                                                                    value: ''
                                                                                                }])}
                                                                                            >
                                                                                                {k}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Card>
                                                                                }
                                                                            >
                                                                                <InputAdornment position={'end'}>
                                                                                    <Tooltip
                                                                                        title={'Common Name Values'}
                                                                                        placement={'top'}>
                                                                                        <IconButton size={'small'}>
                                                                                            {<MenuIcon/>}
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </InputAdornment>
                                                                            </Popover>
                                                                        )
                                                                    }}
                                                                />
                                                                <TextField
                                                                    label={'Value'}
                                                                    onChange={(e) => {
                                                                        setKeyValuePairs([{
                                                                            name: '',
                                                                            value: e.target.value,
                                                                        }]);
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <Popover
                                                                                anchorOrigin={{
                                                                                    horizontal: -100,
                                                                                    vertical: 19
                                                                                }}
                                                                                popOverComponent={
                                                                                    <Card>
                                                                                        {commonTagValueValues.map((value, idx) => (
                                                                                            <MenuItem
                                                                                                key={idx}
                                                                                                onClick={() => setKeyValuePairs([{
                                                                                                    name: '',
                                                                                                    value: value,
                                                                                                }])}
                                                                                            >
                                                                                                {value}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Card>
                                                                                }
                                                                            >
                                                                                <InputAdornment position={'end'}>
                                                                                    <Tooltip
                                                                                        title={'Common Values'}
                                                                                        placement={'top'}>
                                                                                        <IconButton size={'small'}>
                                                                                            {<MenuIcon/>}
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </InputAdornment>
                                                                            </Popover>
                                                                        )
                                                                    }}
                                                                />
                                                                <IconButton size={'small'}>
                                                                    <AddIcon/>
                                                                </IconButton>
                                                                <IconButton size={'small'} disabled>
                                                                    <RemoveIcon/>
                                                                </IconButton>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item>

                                        </Grid>
                                    </Grid>,
                                    <div className={classes.transactionDataFieldLayout}>
                                        <Typography
                                            variant={'body2'}
                                            color={'textSecondary'}
                                            children={'Enter Transaction Data Here'}
                                        />
                                        <TextareaAutosize
                                            // disabled={listingInProgress}
                                            rows={8}
                                            rowsMax={8}
                                            // disabled={apiLoading}
                                            value={dataToPersist}
                                            onChange={(e) => setDataToPersist(e.target.value)}
                                            className={cx(classes.transactionDataTextArea, SolArWorldScrollClassName)}
                                        />
                                        <Typography
                                            variant={'body2'}
                                            color={'textSecondary'}
                                            children={`${dataToPersist.length} Characters`}
                                        />
                                    </div>
                                ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <TransactionStatus/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}