import React from "react";
import {Vector3, HemisphericLight, MeshBuilder, Scene, ArcRotateCamera, SceneLoader} from "@babylonjs/core";
import {SceneComponent} from "../../components/Babylon";
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core"; // uses above component in same directory

let box: any;

// Always need at least the following:
//  scene: to contain the world or model
//  camera: to view it
//  light: to illuminate it
// object(s): stuff(s) to look at
//
const onSceneReady = async (scene: Scene) => {
    // get a handle on the canvas to attach controls
    const canvas = scene.getEngine().getRenderingCanvas();

    // create a camera and attach controls
    const camera = new ArcRotateCamera(
        "camera",
        Math.PI/4, Math.PI/4, 10,
        new Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    // prepare a light
    new HemisphericLight("light", new Vector3(0, 50, 0), scene);

    // load mesh data
    const result = await SceneLoader.ImportMeshAsync(
        ["ground", "semi_house"],
        "https://assets.babylonjs.com/meshes/",
        "both_houses_scene.babylon",
        scene,
    );

    // position
    result.meshes[1].position.x = 0;
    result.meshes[1].position.z = 0;
    result.meshes[1].position.y = 0;
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
    if (box !== undefined) {
        var deltaTimeInMillis = scene.getEngine().getDeltaTime();

        const rpm = 10;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center'
    },
    canvas: {
        width: 'calc(100vw - 260px)',
        height: 'calc(100vh - 54px)',
    }
}))

export default function SolArWorld() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <SceneComponent
                canvasClassName={classes.canvas}
                antialias
                onSceneReady={onSceneReady}
                onRender={onRender}
            />
        </div>
    )
};