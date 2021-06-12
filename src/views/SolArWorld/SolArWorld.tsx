import React from "react";
import {
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    ArcRotateCamera,
    Sound,
    StandardMaterial,
    Color3, Texture
} from "@babylonjs/core";
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
        -Math.PI / 2, Math.PI / 2.5, 10,
        new Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    // prepare a light
    new HemisphericLight("light", new Vector3(0, 50, 0), scene);

    // set up the ground
    const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new Color3(0, 1, 0);
    ground.material = groundMat;

    // setup some textured materials for the box and roof
    const roofMat = new StandardMaterial('roofMat', scene);
    roofMat.diffuseTexture = new Texture(
        'https://storage.googleapis.com/sol-ar-world/roof.jpeg', scene
    );


    const box = MeshBuilder.CreateBox("box", {});
    box.position.y = 0.5;
    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.5, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.rotation.y = Math.PI / 2;
    roof.position.y = 1.22;
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