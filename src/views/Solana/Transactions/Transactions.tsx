import React from "react";
import {
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {}
}))

export default function Transactions() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            transactions
        </div>
    )
}