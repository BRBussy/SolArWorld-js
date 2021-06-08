import {Engine, EngineOptions, Scene, SceneOptions} from "@babylonjs/core";
import React, {useLayoutEffect, useRef} from "react";

export interface SceneComponentProps {
    antialias?: boolean,
    engineOptions?: EngineOptions,
    adaptToDeviceRatio?: boolean,
    sceneOptions?: SceneOptions,
    onRender?: (scene: Scene) => void;
    onSceneReady: (scene: Scene) => void;
    canvasClassName?: string;
}

const SceneComponent = (props: SceneComponentProps) => {
    const reactCanvas = useRef(null);
    const engineRef = useRef<Engine | null>(null);

    useLayoutEffect(() => {
        if (reactCanvas.current) {
            if (!engineRef.current) {
                engineRef.current = new Engine(
                    reactCanvas.current,
                    props.antialias,
                    props.engineOptions,
                    props.adaptToDeviceRatio,
                );
            }
            const scene = new Scene(engineRef.current, props.sceneOptions);
            if (scene.isReady()) {
                props.onSceneReady(scene);
            } else {
                scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
            }

            engineRef.current.runRenderLoop(() => {
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

    return (
        <canvas
            ref={reactCanvas}
            className={props.canvasClassName}
        />
    );
};

export default SceneComponent;