import { Scene } from './scene';

export class SceneManager {
    scenes: Scene[] = [];

    constructor(sceneConfig: { new (): Scene } | { new (): Scene }[]) {
        if (!Array.isArray(sceneConfig)) {
            sceneConfig = [sceneConfig];
        }

        for (const scene of sceneConfig) {
            this.scenes.push(new scene());
        }

        this.bootScene(this.scenes[0]);
    }

    bootScene(scene: Scene) {
        scene.init();
        scene.preload();
    }

    fixedUpdate() {
        for (const scene of this.scenes) {
            if (scene.fixedUpdate) {
                scene.fixedUpdate();
            }
        }
    }

    update() {
        for (const scene of this.scenes) {
            if (scene.update) {
                scene.update();
            }
        }
    }
}
