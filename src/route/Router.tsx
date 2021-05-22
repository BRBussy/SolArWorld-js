import React from 'react';
import {Route, Switch} from 'react-router';
import {Redirect} from 'react-router-dom';
import RouteType from './Route';

interface RouterProps {
    routes: RouteType[];
}

const Router = (props: RouterProps) => {
    return (
        <Switch>
            {props.routes.map((route, key) => {
                // for collapsed routes, we return a route object for each embedded view
                if (route.collapse) {
                    if (route.views == null) {
                        return null;
                    }
                    return (
                        <React.Fragment key={key}>
                            {route.views.map((viewsRoute, viewsKey) => {
                                return (
                                    <Route
                                        key={viewsKey}
                                        exact={!viewsRoute.allowSubPaths}
                                        path={viewsRoute.path}
                                        component={viewsRoute.component}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                }
                // for normal route objects, we return a route object
                if (route.component == null) {
                    return null;
                }
                return (
                    <Route
                        key={key}
                        exact={!route.allowSubPaths}
                        path={route.path}
                        component={route.component}
                    />
                );
            })}
            <Route
                // Route catches all other routes
                path={'/'}
                render={() => {
                    // redirect to the app
                    return (
                        <Redirect to={'/wallet'}/>
                    );
                }}
            />
        </Switch>
    );
};

export default Router;
