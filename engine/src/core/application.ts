import { Loop } from './loop';
import { Scene } from '../scene/scene';
import { SceneManager } from '../scene/scene_manager';
import { Window } from './window';
import { Renderer } from '../renderer/renderer';

type Config = {
    scene: { new (): Scene } | { new (): Scene }[];
    parent?: string;
    backgroundColor?: string | number;
};

export class Application {
    private renderer: Renderer;
    private sceneManager: SceneManager;

    constructor(config: Config) {
        const window = new Window(config.parent || 'body');
        window.setResizeCallback(this.onWindowResize.bind(this));

        this.renderer = new Renderer(window, { clearColor: config.backgroundColor });

        this.sceneManager = new SceneManager(config.scene);
        new Loop(1 / 50, this.fixedUpdate.bind(this), this.update.bind(this));
    }

    fixedUpdate() {
        this.sceneManager.fixedUpdate();
    }

    update() {
        this.sceneManager.update();
        this.renderer.render(this.sceneManager.current);
    }

    onWindowResize(window: Window) {
        this.renderer.onWindowResize(window);
        this.sceneManager.onWindowResize(window);
    }
}
