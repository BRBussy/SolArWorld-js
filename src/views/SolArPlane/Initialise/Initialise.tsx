import React from "react";
import {
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {}
}))

export default function Initialise() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            inigitiase!
        </div>
    )
}