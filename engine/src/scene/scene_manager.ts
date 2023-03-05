import { Scene } from './scene';

export class SceneManager {
    scenes: Scene[] = [];

    constructor(sceneConfig: Scene | Scene[]) {
        if (!Array.isArray(sceneConfig)) {
            sceneConfig = [sceneConfig];
        }

        for (const scene of sceneConfig) {
            this.scenes.push(scene);
        }

        this.bootScene(this.scenes[0]);
    }

    bootScene(scene: Scene) {
        if (scene.init) {
            scene.init();
        }

        if (scene.preload) {
            scene.preload();
        }

        if (scene.create) {
            scene.create();
        }
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
