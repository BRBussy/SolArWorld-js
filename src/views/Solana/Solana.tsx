import React, {useLayoutEffect, useState} from 'react';
import {Grid, makeStyles, Paper, Tab, Tabs} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import RouteType from '../../route/Route'
import {Router} from "../../route";
import cx from "classnames";
import SmartContracts from "./SmartContracts";
import Transactions from './Transactions';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 110px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    }
}));

const solanaTabRoutes: RouteType[] = [
    {
        name: 'Smart Contracts',
        id: 'solana-smart-contracts',
        path: '/solana/smart-contracts',
        component: SmartContracts,
        allowSubPaths: true
    },
    {
        name: 'Transactions',
        id: 'solana-transactions',
        path: '/solana/transactions',
        component: Transactions,
        allowSubPaths: true
    },
];

export default function Solana() {
    const classes = useStyles();
    const history = useHistory();
    const [activeTabRoutePath, setActiveTabRoutePath] = useState('');
    const availableTabRoutes = solanaTabRoutes;

    // navigate to first tab
    useLayoutEffect(() => {
        // confirm that some tab routes are available
        if (!availableTabRoutes.length) {
            console.error('no routes for solana available');
            return;
        }

        // if some are available navigate to first available one
        // unless a path to one of them has already been set
        for (const tabRoute of availableTabRoutes) {
            if (
                (history.location.pathname === tabRoute.path) ||
                (tabRoute.allowSubPaths && history.location.pathname.includes(tabRoute.path))
            ) {
                setActiveTabRoutePath(tabRoute.path);
                return;
            }
        }
        history.push(availableTabRoutes[0].path);
        setActiveTabRoutePath(availableTabRoutes[0].path);
    }, [availableTabRoutes, history]);

    // do not render until active tab has been determined
    if (!activeTabRoutePath) {
        return null;
    }

    return (
        <>
            <Paper square>
                <Grid container>
                    <Grid item>
                        <Tabs
                            value={activeTabRoutePath}
                            onChange={(_, value) => {
                                if (activeTabRoutePath === value) {
                                    return;
                                }
                                setActiveTabRoutePath(value);
                                history.push(value);
                            }}
                            textColor={'secondary'}
                        >
                            {availableTabRoutes.map((t, i) => (
                                <Tab
                                    key={i}
                                    value={t.path}
                                    label={t.name}
                                />
                            ))}
                        </Tabs>
                    </Grid>
                </Grid>
            </Paper>
            <div className={cx(classes.content, 'solArWorldScroll')}>
                <Router routes={availableTabRoutes}/>
            </div>
        </>
    );
}
