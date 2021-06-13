import React from "react";
import {
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    ArcRotateCamera,
    Sound,
    StandardMaterial,
    Color3, Texture, Vector4, Mesh,
    SceneLoader, AssetsManager
} from "@babylonjs/core";
import '@babylonjs/loaders'
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

    /******** Set Camera and Light ********/
        // create a camera and attach controls
    const camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2, Math.PI / 2.5, 10,
        new Vector3(0, 0, 0),
        scene
        );
    camera.attachControl(canvas, true);

    // prepare a light
    new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    /******** Materials - Coloured ********/
    const groundMat = new StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new Color3(0, 1, 0);

    /******** Materials - Textured ********/
        // const boxMat = new StandardMaterial('boxMat', scene);
        // boxMat.diffuseTexture = new Texture(
        //     "https://assets.babylonjs.com/environments/semihouse.png", scene,
        // )

    const roofMat = new StandardMaterial('roofMat', scene);
    roofMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/roof.jpg", scene
    );

    const beaconBlob = await downloadBlob(
        'https://storage.googleapis.com/sol-ar-world/HulkChickArms.stl'
    );
    const beaconURL = URL.createObjectURL(beaconBlob);


    SceneLoader.Append(
        'https://storage.googleapis.com/sol-ar-world/HulkChickArms.stl',
        undefined,
        scene,
        function (scene) {
        // do something with the scene
            console.log('successful?')
    });


    /******** World Objects ********/

    buildGround(scene);
};

const loadModel = async (s: Scene) => {

}

const buildGround = (s: Scene): Mesh => {
    //color
    const groundMat = new StandardMaterial("groundMat", s);
    groundMat.diffuseColor = new Color3(0, 1, 0);

    const ground = MeshBuilder.CreateGround("ground", {width: 10, height: 10});
    ground.material = groundMat;

    return ground;
}

const buildBox = (s: Scene): Mesh => {
    //texture
    const boxMat = new StandardMaterial("boxMat", s);
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", s)


    //options parameter to set different images on each side
    const faceUV = [];
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    // top 4 and bottom 5 not seen so not set


    /**** World Objects *****/
    const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
    box.material = boxMat;
    box.position.y = 0.5;

    return box;
}

const buildRoof = (s: Scene): Mesh => {
    //texture
    const roofMat = new StandardMaterial("roofMat", s);
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", s);

    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    return roof;
}

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