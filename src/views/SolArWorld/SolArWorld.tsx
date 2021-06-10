import React from "react";
import {Vector3, HemisphericLight, MeshBuilder, Scene, ArcRotateCamera, Sound} from "@babylonjs/core";
import {SceneComponent} from "../../components/Babylon";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Card, CardContent, Theme} from "@material-ui/core";
import {downloadBlob} from "../../utilities/network";

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
        -Math.PI / 2, Math.PI / 4, 10,
        new Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    // prepare a light
    new HemisphericLight("light", new Vector3(0, 50, 0), scene);

    // place that ground
    MeshBuilder.CreateGround("ground", {width: 10, height: 10});

    // make some boxes brah
    const box1 = MeshBuilder.CreateBox(
        'box1', {
            width: 1,
            height: 2,
            depth: 3
        },
    )
    box1.position.x = -2;
    box1.position.y = 1;

    const box2 = MeshBuilder.CreateBox(
        'box2', {
            width: 1,
            height: 2,
            depth: 3
        },
    )
    box2.position.x = 0;
    box2.position.y = 1;

    const box3 = MeshBuilder.CreateBox(
        'box3', {
            width: 1,
            height: 2,
            depth: 3
        },
    )
    box3.position.x = 2
    box3.position.y = 1;
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
    },
    controlPanel: {
        position: 'absolute',
        top: 100,
        left: 100
    }
}))

export default function SolArWorld() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Card className={classes.controlPanel}>
                <CardContent>
                    <Button
                        children={'do thing'}
                        onClick={async () => {
                            console.log('download blobby')
                            const blob = await downloadBlob(
                                'https://storage.googleapis.com/sol-ar-world/cello.mp3'
                            );
                        }}
                    />
                </CardContent>
            </Card>
            <SceneComponent
                canvasClassName={classes.canvas}
                antialias
                onSceneReady={onSceneReady}
                onRender={onRender}
            />
        </div>
    )
};