import React, {useState} from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader, CircularProgress,
    Grid,
    IconButton,
    makeStyles, Menu, MenuItem,
    TextField,
    Tooltip,
    Typography,
    Collapse, InputAdornment,
} from "@material-ui/core";
import cx from "classnames";
import {
    AccountBalanceWallet as WalletIcon,
    AddCircleOutlined as AddIcon,
    RemoveCircleOutlined as RemoveIcon,
    ExpandLess as CloseFilterPanelIcon,
    ExpandMore as OpenFilterPanelIcon, ExpandMore as MenuIcon,
} from '@material-ui/icons';
import {useArweaveContext} from "../../../context/Arweave";
import {FETable} from "../../../components/Table/FETable";
import {TransactionInterface} from "arweave/web/lib/transaction";
import {useSnackbar} from "notistack";
import {DateTime} from 'luxon';
import TransactionStatus from "../../../components/Arweave/TransactionStatus";
import Popover from "../../../components/PopOver/Popover";
import {commonTagNameValues, commonTagValueValues} from "../../../common";
import {useWalletContext} from "../../../context/Wallet";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(2)
    },
    filterCardTitleRoot: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    twoColumns: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
    border: {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`
    },
    accountIDField: {
        width: 300
    },
    kvWrapper: {
        maxHeight: 200,
        overflowY: 'scroll',
    },
    kvLineItem: {
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        columnGap: theme.spacing(.5)
    }
}))

export default function Transactions() {
    const classes = useStyles();
    const {wallet} = useWalletContext();
    const {arweaveGQLClient} = useArweaveContext();
    const [retrievedTransactions, setRetrievedTransactions] = useState<TransactionInterface[]>([]);
    const [filterPanelOpen, setFilterPanelOpen] = useState(true);
    const {enqueueSnackbar} = useSnackbar();

    // const [pageSize, setPageSize] = useState(15);
    // const [lastRecordIdx, setLastRecordIdx] = useState(15);

    //
    // transaction ID filter
    //
    const [transactionID, setTransactionID] = useState('');

    //
    // account ID filter
    //
    const [accountID, setAccountID] = useState('');
    const [anchorElAccountMenu, setAnchorElAccountMenu] = React.useState<null | HTMLElement>(null);
    const handleCloseAccountMenu = () => {
        setAnchorElAccountMenu(null);
    };
    const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElAccountMenu(event.currentTarget);
    };

    //
    // key, value pair filter
    //
    const [keyValuePairs, setKeyValuePairs] = useState<{ name: string, value: string }[]>([]);

    //
    // perform query
    //
    const [queryLoading, setQueryLoading] = useState(false);
    const handlePerformQuery = async () => {
        setQueryLoading(true);
        try {
            setRetrievedTransactions(await arweaveGQLClient.getTransactions({
                transactionIDs: transactionID ? [transactionID] : [],
                accountOwnerIDs: accountID ? [accountID] : [],
                tags: keyValuePairs,
            }))
        } catch (e) {
            console.error(`failed to run query --> ${e}`)
            enqueueSnackbar(
                `Failed to Run Query --> ${e}`,
                {variant: 'error'}
            )
        }
        setQueryLoading(false);
    }

    return (
        <>
            <div className={classes.root}>
                <Card>
                    <CardHeader
                        disableTypography
                        title={
                            <div className={classes.filterCardTitleRoot}>
                                <Grid container spacing={1} alignItems={'center'}>
                                    {([
                                        <Button
                                            onClick={handlePerformQuery}
                                            variant={'contained'}
                                            children={'Run Query'}
                                        />,
                                        queryLoading ? <CircularProgress size={20}/> : null
                                    ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                                </Grid>
                                <Grid container spacing={1} alignItems={'center'}>
                                    {([
                                        <Tooltip
                                            placement={'top'}
                                            title={filterPanelOpen ? 'Hide Filters' : 'Show Filters'}
                                        >
                                            <IconButton
                                                size={'small'}
                                                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                                            >
                                                {filterPanelOpen ? <CloseFilterPanelIcon/> : <OpenFilterPanelIcon/>}
                                            </IconButton>
                                        </Tooltip>,
                                        queryLoading ? <CircularProgress size={20}/> : null
                                    ]).map((n, idx) => (<Grid item key={idx}>{n}</Grid>))}
                                </Grid>
                            </div>
                        }
                    />
                    <Collapse in={filterPanelOpen}>
                        <CardContent>
                            <Grid container spacing={1}>
                                {([
                                    <TextField
                                        label={'By Transaction ID'}
                                        value={transactionID}
                                        onChange={(e) => setTransactionID(e.target.value)}
                                    />,

                                    <div className={cx(classes.twoColumns, classes.border)}>
                                        <TextField
                                            label={'By Account ID (Transaction Owner)'}
                                            className={classes.accountIDField}
                                            onChange={(e) => setAccountID(e.target.value)}
                                            value={accountID}
                                        />
                                        <Tooltip
                                            placement={'top'}
                                            title={wallet.arweaveKeys.length
                                                ? 'Select an account from the in app wallet to search for transactions from'
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
                                    </div>,

                                    <div className={cx(classes.border)}>
                                        <Typography
                                            variant={'body2'}
                                            color={'textSecondary'}
                                            children={'By Name-Value Pair (e.g. Content-Type - text/html)'}
                                        />
                                        <div className={cx(classes.kvWrapper, 'solArWorldScroll')}>
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
                                                                                {commonTagNameValues.map((value, nIdx) => (
                                                                                    <MenuItem
                                                                                        key={nIdx}
                                                                                        onClick={() => {
                                                                                            keyValuePairs[idx].name = value;
                                                                                            setKeyValuePairs([...keyValuePairs]);
                                                                                        }}
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
                                                                                        onClick={() => {
                                                                                            keyValuePairs[idx].value = value;
                                                                                            setKeyValuePairs([...keyValuePairs]);
                                                                                        }}
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
                                                                                {commonTagNameValues.map((value, nIdx) => (
                                                                                    <MenuItem
                                                                                        key={nIdx}
                                                                                        onClick={() => {
                                                                                            setKeyValuePairs([{
                                                                                                name: value,
                                                                                                value: '',
                                                                                            }]);
                                                                                        }}
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
                                                                                {commonTagNameValues.map((value, nIdx) => (
                                                                                    <MenuItem
                                                                                        key={nIdx}
                                                                                        onClick={() => {
                                                                                            setKeyValuePairs([{
                                                                                                name: '',
                                                                                                value: value,
                                                                                            }]);
                                                                                        }}
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
                                    </div>,

                                    <TransactionStatus/>
                                ]).map((f, idx) => (<Grid item key={idx}>{f}</Grid>))}
                            </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
                <Card>
                    <CardContent>
                        <FETable
                            denseTable
                            title={'Retrieved Transactions'}
                            onPageNumberChange={(newPageNumber: number) => console.log('we are now on page number: ', newPageNumber)}
                            onPageSizeChange={(newPageSize: number) => console.log('we are now on page size: ', newPageSize)}
                            height={window.innerHeight - (filterPanelOpen ? 355 : 230)}
                            columns={[
                                {
                                    label: 'Timestamp',
                                    field: 'timestamp',
                                    minWidth: 145,
                                    accessor: (txn) => {
                                        try {
                                            // 09/05/2021, 13:17:14
                                            return `${DateTime.fromSeconds(txn.block.timestamp).toFormat('F')} (UTC)`;
                                        } catch (e) {
                                            console.error(`error rendering data cell: ${e}`)
                                            return '-';
                                        }
                                    }
                                },
                                {
                                    label: 'ID',
                                    field: 'id'
                                },
                                {
                                    label: 'Owner',
                                    field: 'id',
                                    accessor: (data) => {
                                        try {
                                            // FIXME: revert to using proper type once TxnInterface is updated
                                            return (data as any).owner.address;
                                        } catch (e) {
                                            console.error(`error getting owner.adderss: ${e}`)
                                            return '-';
                                        }
                                    }
                                },
                                {
                                    label: 'Data',
                                    field: 'data',
                                    accessor: (txn) => {
                                        // FIXME: revert to using proper type once TxnInterface is updated
                                        try {
                                            return (
                                                <div>
                                                    <Typography
                                                        variant={'body2'}
                                                        children={txn.data.size}
                                                    />
                                                    <Typography
                                                        variant={'body2'}
                                                        children={txn.data.type}
                                                    />
                                                </div>
                                            )
                                        } catch (e) {
                                            console.error(`error rendering data cell: ${e}`)
                                            return '-';
                                        }
                                    }
                                },
                                {
                                    label: 'Tags',
                                    field: 'tags',
                                    accessor: (txn) => {
                                        // FIXME: revert to using proper type once TxnInterface is updated
                                        try {
                                            return (
                                                <ul>
                                                    {txn.tags.map((t: any, idx: number) => (
                                                        <li key={idx}>
                                                            {`${t.name}: ${t.value}`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )
                                        } catch (e) {
                                            console.error(`error rendering data cell: ${e}`)
                                            return '-';
                                        }
                                    }
                                },
                                {
                                    label: 'Fee',
                                    field: 'fee',
                                    accessor: (data) => {
                                        try {
                                            // FIXME: revert to using proper type once TxnInterface is updated
                                            return `${(data as any).fee.ar} AR`;
                                        } catch (e) {
                                            console.error(`error getting fee.winston: ${e}`)
                                            return '-';
                                        }
                                    }
                                },
                            ]}
                            data={retrievedTransactions}
                        />
                    </CardContent>
                </Card>
            </div>


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
                        onClick={() => setAccountID(k.address)}
                    >
                        {k.address}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}