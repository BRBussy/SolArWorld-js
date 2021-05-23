import {Engine, EngineOptions, Scene, SceneOptions} from "@babylonjs/core";
import React, {useLayoutEffect, useRef} from "react";

export interface SceneComponentProps {
    antialias?: boolean,
    engineOptions?: EngineOptions,
    adaptToDeviceRatio?: boolean,
    sceneOptions?: SceneOptions,
    onRender?: (scene: Scene) => void;
    onSceneReady: (scene: Scene) => void;
}

const SceneComponent = (props: SceneComponentProps) => {
    const reactCanvas = useRef(null);

    useLayoutEffect(() => {
        if (reactCanvas.current) {
            const engine = new Engine(
                reactCanvas.current,
                props.antialias,
                props.engineOptions,
                props.adaptToDeviceRatio,
            );
            const scene = new Scene(engine, props.sceneOptions);
            if (scene.isReady()) {
                props.onSceneReady(scene);
            } else {
                scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
            }

            engine.runRenderLoop(() => {
                if (typeof props.onRender === "function") {
                    props.onRender(scene);
                }
                scene.render();
            });

            const resize = () => {
                scene.getEngine().resize();
            };

            if (window) {
                window.addEventListener("resize", resize);
            }

            return () => {
                scene.getEngine().dispose();

                if (window) {
                    window.removeEventListener("resize", resize);
                }
            };
        }
    }, [
        reactCanvas,
        props,
    ]);

    return <canvas ref={reactCanvas}/>;
};

export default SceneComponent;