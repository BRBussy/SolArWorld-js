import React, {useLayoutEffect, useState} from 'react';
import {Grid, makeStyles, Paper, Tab, Tabs} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import RouteType from '../../route/Route'
import {Router} from "../../route";
import cx from "classnames";
import LandBuilder from "./LandBuilder";
import Explore from './Explore';
import {SolArWorldScrollClassName} from "../../common";
import Initialise from "./Initialise";

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 110px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    }
}));

const solArPlaneTabRoutes: () => RouteType[] = () => {
    let routes = [
        {
            name: 'Land Builder',
            id: 'solArPlane-land-builder',
            path: '/solArPlane/land-builder',
            component: LandBuilder,
            allowSubPaths: true
        },
        {
            name: 'Explore',
            id: 'solArPlane-explore',
            path: '/solArPlane/explore',
            component: Explore,
            allowSubPaths: true
        },
    ];

    if (localStorage.getItem('initialiseLandProgram')) {
        routes = [
            {
                name: 'Initialise',
                id: 'solArPlane-initialise',
                path: '/solArPlane/initialise',
                component: Initialise,
                allowSubPaths: true
            },
            ...routes,
        ]
    }

    return routes;
};

export default function SolArPlane() {
    const classes = useStyles();
    const history = useHistory();
    const [activeTabRoutePath, setActiveTabRoutePath] = useState('');
    const availableTabRoutes = solArPlaneTabRoutes();

    // navigate to first tab
    useLayoutEffect(() => {
        // confirm that some tab routes are available
        if (!availableTabRoutes.length) {
            console.error('no routes for solArPlane available');
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
            <div className={cx(classes.content, SolArWorldScrollClassName)}>
                <Router routes={availableTabRoutes}/>
            </div>
        </>
    );
}
