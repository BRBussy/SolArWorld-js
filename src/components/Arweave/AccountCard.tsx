import React, {useLayoutEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    makeStyles,
    Theme,
    Tooltip, Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails, Table, TableBody, TableHead, TableRow, TableCell, CircularProgress
} from '@material-ui/core';
import {DisplayField} from '../../components/Form';
import {
    ExpandLess as CloseCardBodyIcon,
    ExpandMore as OpenCardBodyIcon,
    Refresh as RefreshIcon
} from '@material-ui/icons';
import cx from 'classnames';
import {useColorContext} from '../../context/Color';
import {ArweaveKey} from "../../solArWorld";
import {useArweaveContext} from '../../context/Arweave';

const useStyles = makeStyles((theme: Theme) => ({
    accountCardHeader: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center'
    },
    backgroundColor: {
        backgroundColor: theme.palette.background.default
    },
    balanceDetails: {
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    tableWrapper: {
        transition: 'height 0.3s ease-out',
        overflow: 'auto'
    },
    headerRowCell: {
        fontSize: 12,
        padding: theme.spacing(0.5, 1, 0.5, 0)
    },
    tableRowCell: {
        padding: theme.spacing(0.5, 1, 0.5, 0),
        fontSize: 12
    },
    issuerRowCell: {
        width: 470
    },
    issuerRowCellSmall: {
        display: 'block',
        width: 200,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    accordionSummaryContent: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    }
}));

interface Props {
    arwaveKey: ArweaveKey;
    invertColors?: boolean;
    maxWidth?: number;
}

const tableHeight = 200

export default function AccountCard(props: Props) {
    const classes = useStyles();
    const {arweaveClient} = useArweaveContext();
    const [accountCardOpen, setAccountCardOpen] = useState(false);

    // color
    const {colorContextGetRandomColorForKey} = useColorContext();
    const color = colorContextGetRandomColorForKey(props.arwaveKey.address);

    //
    // get balance
    //
    const [refreshARBalanceToggle, setRefreshARBalanceToggle] = useState(false);
    const [arBalance, setARBalance] = useState('0');
    const [arBalanceLoading, setARBalanceLoading] = useState(false);
    useLayoutEffect(() => {
        (async () => {
            try {
                setARBalanceLoading(true);
                setARBalance(
                    `${((+(await arweaveClient.getBalanceForAddress(props.arwaveKey.address))) / 1000000000000).toFixed(10)}`
                )
            } catch (e) {
                console.error(`error getting balance: ${e}`);
            }
            setARBalanceLoading(false);
        })()
    }, [props.arwaveKey, arweaveClient, refreshARBalanceToggle])

    return (
        <Card className={cx({[classes.backgroundColor]: !!props.invertColors})}>
            <CardHeader
                disableTypography
                title={
                    <div className={classes.accountCardHeader}>
                        <DisplayField
                            label={'Address'}
                            value={props.arwaveKey.address}
                            valueTypographyProps={{style: {color}}}
                        />
                        <Tooltip
                            title={accountCardOpen ? 'Show Less' : 'Show More'}
                            placement={'top'}
                        >
                            <span>
                                <IconButton
                                    size={'small'}
                                    onClick={() => setAccountCardOpen(!accountCardOpen)}
                                >
                                    {accountCardOpen
                                        ? <CloseCardBodyIcon/>
                                        : <OpenCardBodyIcon/>
                                    }
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>
                }
            />
            <Collapse in={accountCardOpen}>
                <CardContent>
                    <Accordion className={props.invertColors ? undefined : classes.backgroundColor}>
                        <AccordionSummary expandIcon={<OpenCardBodyIcon/>}>
                            <div className={classes.accordionSummaryContent}>
                                <Typography
                                    children={'Balances'}
                                />
                                {arBalanceLoading
                                    ? (<CircularProgress size={30}/>)
                                    : (
                                        <Tooltip
                                            title={'Refresh'}
                                            placement={'top'}
                                        >
                                            <span>
                                                <IconButton
                                                    size={'small'}
                                                    disabled={arBalanceLoading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRefreshARBalanceToggle(!refreshARBalanceToggle);
                                                    }}
                                                >
                                                    <RefreshIcon/>
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    )
                                }
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className={classes.balanceDetails}>
                            <div
                                className={classes.tableWrapper}
                                style={{
                                    maxHeight: tableHeight,
                                    width: props.maxWidth
                                }}
                            >
                                <Table stickyHeader padding={'none'}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.headerRowCell}>
                                                Code
                                            </TableCell>
                                            <TableCell className={classes.headerRowCell}>
                                                Balance
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className={classes.tableRowCell}>
                                                AR
                                            </TableCell>
                                            <TableCell className={classes.tableRowCell}>
                                                {arBalance}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Collapse>
        </Card>
    )
}