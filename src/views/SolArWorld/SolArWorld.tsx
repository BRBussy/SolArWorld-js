import React from 'react';
import {makeStyles} from '@material-ui/core';
import cx from "classnames";
import {SolArWorldScrollClassName} from "../../common";

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 110px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    }
}));

export default function SolArWorld() {
    const classes = useStyles();

    return (
        <div className={cx(classes.content, SolArWorldScrollClassName)}>
            Solar world!!!!
        </div>
    );
}
