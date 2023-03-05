import { Scene } from './scene';

export class SceneManager {
    scenes: Scene[] = [];

    constructor() {
        // empty
    }

    create(scene: Scene) {
        this.scenes.push(scene);

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
