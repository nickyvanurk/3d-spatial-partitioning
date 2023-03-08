import { Scene } from '../scene/scene';
import { SceneManager } from '../scene/scene_manager';
import { Window } from './window';
import { Renderer } from '../renderer/renderer';
import { Time } from './time';
import { SceneTree } from '../scene/scene_tree';

type Config = {
    fps: number;
    scene: typeof Scene | (typeof Scene)[];
    parent: string;
    clearColor: string | number;
};

export class Application {
    private config: Config = { fps: 1 / 50, scene: [], parent: 'body', clearColor: 0x0000 };
    private renderer: Renderer;
    private sceneManager: SceneManager;

    private sceneTree: SceneTree;

    constructor(config: Partial<Config>) {
        this.config = { ...this.config, ...config };

        const w = new Window(config.parent);
        w.setResizeCallback(this.onWindowResize.bind(this));

        this.renderer = new Renderer(w, { clearColor: this.config.clearColor });

        this.sceneManager = new SceneManager(this.config.scene);

        this.sceneTree = new SceneTree();

        Time.fixedDeltaTime = this.config.fps;
        Time.last = window.performance.now();
        window.requestAnimationFrame(this.run.bind(this));
    }

    run() {
        Time.now = window.performance.now();
        Time.deltaTime = Math.min((Time.now - Time.last) / 1000, 0.25);
        Time.last = Time.now;

        Time.accumulator += Time.deltaTime;
        if (Time.accumulator >= Time.fixedDeltaTime) {
            this.sceneManager.fixedUpdate();
            Time.fixedTime += Time.fixedDeltaTime;
            Time.accumulator -= Time.fixedDeltaTime;
        }

        Time.alpha = Time.accumulator / Time.fixedDeltaTime;
        this.sceneManager.update();
        this.renderer.render(this.sceneManager.current);
        Time.time += Time.deltaTime;

        window.requestAnimationFrame(this.run.bind(this));
    }

    onWindowResize(window: Window) {
        this.sceneManager.onWindowResize(window);
        this.renderer.onWindowResize(window);
    }
}
