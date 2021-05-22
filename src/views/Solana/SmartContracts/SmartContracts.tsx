import React, {useLayoutEffect, useState} from 'react';
import {Card, CardContent, Grid, makeStyles, Tab, Tabs} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import RouteType from '../../../route/Route'
import {Router} from "../../../route";
import cx from "classnames";
import SPLFT from "./SPLFT";
import SPLNFT from "./SPLNFT";

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 130px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    },
    tabBarWrapper: {
        backgroundColor: theme.palette.background.default
    }
}));

const solanaTabRoutes: RouteType[] = [
    {
        name: 'SPL Fungible',
        id: 'solana-smart-contracts-spl-ft',
        path: '/solana/smart-contracts/spl-ft',
        component: SPLFT,
        allowSubPaths: true
    },
    {
        name: 'SPL Non-Fungible',
        id: 'solana-smart-contracts-spl-nft',
        path: '/solana/smart-contracts/spl-nft',
        component: SPLNFT,
        allowSubPaths: true
    },
];

export default function SmartContracts() {
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
            <Card className={cx(classes.content, 'solArWorldScroll')}>
                <Grid container className={classes.tabBarWrapper}>
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
                <CardContent>
                    <Router routes={availableTabRoutes}/>
                </CardContent>
            </Card>
        </>
    );
}
