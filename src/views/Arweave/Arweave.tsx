import React, {useLayoutEffect, useState} from 'react';
import {Grid, makeStyles, Paper, Tab, Tabs, Typography} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import RouteType from '../../route/Route'
import Transactions from "./Transactions";
import Upload from "./Upload";
import {Router} from "../../route";
import cx from "classnames";
import {useArweaveContext} from "../../context/Arweave";

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 110px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    },
}));

const explorerTabRoutes: RouteType[] = [
    {
        name: 'Transactions',
        id: 'arweave-transactions',
        path: '/arweave/transactions',
        component: Transactions,
        allowSubPaths: true
    },
    {
        name: 'Upload',
        id: 'arweave-upload',
        path: '/arweave/upload',
        component: Upload,
        allowSubPaths: true
    },
];

export default function Arweave() {
    const classes = useStyles();
    const history = useHistory();
    const {usingArweaveTestNet} = useArweaveContext();
    const [activeTabRoutePath, setActiveTabRoutePath] = useState('');
    const availableTabRoutes = explorerTabRoutes;

    // navigate to first tab
    useLayoutEffect(() => {
        // confirm that some tab routes are available
        if (!availableTabRoutes.length) {
            console.error('no routes for explorer available');
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
                <Grid container direction={'row'}>
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
                    {usingArweaveTestNet &&
                    <Grid item>
                        <Typography>
                            !!! USING SolArWorld TEST NET !!!
                        </Typography>
                    </Grid>
                    }
                </Grid>
            </Paper>
            <div className={cx(classes.content, 'solArWorldScroll')}>
                <Router routes={availableTabRoutes}/>
            </div>
        </>
    );
}
