import React from 'react';
import {
    makeStyles, AppBar, Toolbar, useMediaQuery, useTheme, IconButton
} from '@material-ui/core';
import {Breakpoint} from '@material-ui/core/styles/createBreakpoints';
import {isWidthUp} from '@material-ui/core/withWidth';
import cx from 'classnames';
import {
    Menu, MoreVert
} from '@material-ui/icons';

const useStyles = makeStyles((Theme) => ({
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
        float: 'left'
    }
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

interface HeaderProps {
    miniActive: boolean;
    sidebarMinimize: () => void;
    handleSidebarToggle: () => void;
}

export default function Header(props: HeaderProps) {
    const classes = useStyles();
    const width = useWidth();

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
                        asdfasdf
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
