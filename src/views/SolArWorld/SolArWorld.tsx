import React from "react";
import {FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Mesh} from "@babylonjs/core";
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
import {SceneWithSpinningBoxes} from "./SpinningBox";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2, 2, 0, 2),
        height: 'calc(100vh - 110px)',
        overflowX: 'hidden',
        overflowY: 'scroll'
    }
}))

export default function SolArWorld() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <SceneWithSpinningBoxes/>
        </div>
    )
};