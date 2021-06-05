import React, {useMemo, useState} from 'react';
import {
    makeStyles,
    AppBar,
    Toolbar,
    useMediaQuery,
    useTheme,
    IconButton,
    Theme,
    Typography,
    Avatar,
    createStyles,
    withStyles, Badge, Tooltip
} from '@material-ui/core';
import {Breakpoint} from '@material-ui/core/styles/createBreakpoints';
import {isWidthUp} from '@material-ui/core/withWidth';
import cx from 'classnames';
import {
    AccountBalanceWallet as WalletIcon,
    Menu, MoreVert, Opacity as AirDropIcon
} from '@material-ui/icons';
import {useSolanaContext} from "../../context/Solana";
import {SolanaNetwork} from "../../solArWorld/solana";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        position: 'absolute',
        width: '100%',
        zIndex: 1029,
        border: '0',
        transition: 'all 150ms ease 0s',
        height: '50px',
        display: 'flex',
        boxShadow: '0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
        padding: 0
    },

    //
    // desktop layout
    //
    toolbarDesktop: {
        height: '50px',
        minHeight: '50px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center'
    },
    sidebarMiniIcon: {
        width: '20px',
        height: '17px'
    },
    desktopViewName: {
        paddingLeft: '10px'
    },

    //
    // mini layout
    //
    toolbarMini: {
        height: '50px',
        minHeight: '50px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    logoMini: {
        width: '30px',
        verticalAlign: 'middle',
        border: '0'
    },

    //
    // solana wallet selection
    //
    solanaWalletSelection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        alignItems: 'center',
        columnGap: theme.spacing(1)
    },
}))

function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
}

const WalletConnectingBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.main,
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }),
)(Badge);

const NoWalletBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.main,
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        }
    }),
)(Badge);

const WalletConnectedBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.main,
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        }
    }),
)(Badge);

interface HeaderProps {
    miniActive: boolean;
    sidebarMinimize: () => void;
    handleSidebarToggle: () => void;
}

export default function Header(props: HeaderProps) {
    const classes = useStyles();
    const width = useWidth();
    const {enqueueSnackbar} = useSnackbar();
    const [airdropInProgress, setAirDropInProgress] = useState(false);
    const {
        solanaSelectedWallet,
        solanaWalletInitialising,
        showSolanaWalletSelector,
        solanaRPCConnection,
        solanaNetwork
    } = useSolanaContext();

    const onSolanaTestNet = useMemo(() => ([
        SolanaNetwork.Testnet,
        SolanaNetwork.LocalTestnet,
        SolanaNetwork.Devnet,
    ]).includes(solanaNetwork), [solanaNetwork])

    if (isWidthUp('md', width)) {
        return (
            <AppBar
                className={cx(classes.appBar)}
            >
                <Toolbar className={classes.toolbarDesktop}>
                    <div>
                        <IconButton
                            size={'small'}
                            onClick={props.sidebarMinimize}
                        >
                            {props.miniActive
                                ? <MoreVert/>
                                : <MoreVert/>
                            }
                        </IconButton>
                    </div>
                    <div className={classes.solanaWalletSelection}>
                        {(() => {
                            if (solanaWalletInitialising) {
                                return (
                                    <>
                                        <WalletConnectingBadge
                                            overlap="circle"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            variant="dot"
                                            onClick={(event: React.MouseEvent<HTMLElement>) => showSolanaWalletSelector(event.currentTarget)}
                                        >
                                            <Avatar>
                                                <WalletIcon/>
                                            </Avatar>
                                        </WalletConnectingBadge>
                                        <Typography
                                            children={`Wallet Connecting`}
                                        />
                                    </>
                                )
                            }

                            // if no solana wallet is set
                            if (!solanaSelectedWallet) {
                                //
                                return (
                                    <>
                                        <NoWalletBadge
                                            overlap="circle"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            variant="dot"
                                            onClick={(event: React.MouseEvent<HTMLElement>) => showSolanaWalletSelector(event.currentTarget)}
                                        >
                                            <Avatar>
                                                <WalletIcon/>
                                            </Avatar>
                                        </NoWalletBadge>
                                        <Typography
                                            children={'No Wallet'}
                                        />
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <WalletConnectedBadge
                                            overlap="circle"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            variant="dot"
                                            onClick={(event: React.MouseEvent<HTMLElement>) => showSolanaWalletSelector(event.currentTarget)}
                                        >
                                            <Avatar alt="wallet" src={solanaSelectedWallet.metadata().iconURL}/>
                                        </WalletConnectedBadge>
                                        <Typography
                                            children={`${solanaSelectedWallet.metadata().provider} Connected`}
                                        />
                                        {onSolanaTestNet &&
                                        <Tooltip
                                            title={'Air Drop 1 SOL into wallet'}
                                            placement={'top'}
                                        >
                                            <IconButton
                                                size={'small'}
                                                onClick={async () => {
                                                    if (!solanaRPCConnection) {
                                                        console.error('solana rpc connection not set');
                                                        return;
                                                    }
                                                    if (!solanaSelectedWallet) {
                                                        console.error('solana wallet not set')
                                                        return;
                                                    }
                                                    setAirDropInProgress(true);
                                                    try {
                                                        const signature = await solanaRPCConnection.requestAirdrop(
                                                            solanaSelectedWallet.publicKey(),
                                                            LAMPORTS_PER_SOL,
                                                        );
                                                        await solanaRPCConnection.confirmTransaction(signature);
                                                        enqueueSnackbar(
                                                            `Airdrop to ${solanaSelectedWallet.publicKey().toString()} Complete`,
                                                            {variant: 'success'}
                                                        )
                                                    } catch (e) {
                                                        console.error(`error performing airdrop: ${e}`);
                                                        enqueueSnackbar(
                                                            `error performing airdrop: ${e}`,
                                                            {variant: 'error'}
                                                        )
                                                    }
                                                    setAirDropInProgress(false);
                                                }}
                                            >
                                                <AirDropIcon/>
                                            </IconButton>
                                        </Tooltip>
                                        }
                                    </>
                                )
                            }
                        })()}
                    </div>
                </Toolbar>
            </AppBar>
        );
    } else {
        return (
            <AppBar
                className={cx(classes.appBar)}
            >
                <Toolbar className={classes.toolbarMini}>
                    <div>
                        :_)
                    </div>
                    <IconButton
                        size={'small'}
                        onClick={props.handleSidebarToggle}
                    >
                        <Menu/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}
