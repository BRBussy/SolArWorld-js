import React from 'react';

export default interface RouteType {
    name: string;
    id: string;
    path: string;
    icon?: React.ComponentType;
    component?: React.ComponentType;
    collapse?: boolean;
    allowSubPaths?: boolean;
    views?: {
        name: string,
        path: string,
        icon: React.ComponentType;
        component: React.ComponentType;
        allowSubPaths?: boolean;
    }[];
}
