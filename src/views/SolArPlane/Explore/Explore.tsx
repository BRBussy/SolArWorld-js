import React from "react";
import {
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {}
}))

export default function Explore() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            Explore
        </div>
    )
}