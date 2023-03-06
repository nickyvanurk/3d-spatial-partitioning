import { Scene } from './scene';

export class SceneManager {
    scenes: Scene[] = [];
    current: Scene;

    constructor(sceneConfig: typeof Scene | (typeof Scene)[]) {
        if (!Array.isArray(sceneConfig)) {
            sceneConfig = [sceneConfig];
        }

        for (const scene of sceneConfig) {
            const s = new scene();
            s.manager = this;
            this.scenes.push(s);
        }

        this.current = this.scenes[0];
        this.current.init();
        this.current.preload();
    }

    fixedUpdate() {
        this.current.fixedUpdate();
    }

    update() {
        this.current.update();
    }

    switch(name: string) {
        console.log('switching to ', name, ' scene');
    }
}
