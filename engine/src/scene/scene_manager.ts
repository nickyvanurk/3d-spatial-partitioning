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
        if (scene.init) {
            scene.init();
        }

        if (scene.preload) {
            scene.preload(); // Calls scene.create when done loading
        } else if (scene.create) {
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
