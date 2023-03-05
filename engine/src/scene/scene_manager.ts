import { Scene } from './scene';

export class SceneManager {
    scenes: Scene[] = [];
    current: Scene;

    constructor(sceneConfig: { new (): Scene } | { new (): Scene }[]) {
        if (!Array.isArray(sceneConfig)) {
            sceneConfig = [sceneConfig];
        }

        for (const scene of sceneConfig) {
            this.scenes.push(new scene());
        }

        this.current = this.scenes[0];
        this.current.init();
        this.current.preload();
    }

    fixedUpdate() {
        for (const scene of this.scenes) {
            scene.fixedUpdate();
        }
    }

    update() {
        for (const scene of this.scenes) {
            scene.update();
        }
    }
}
