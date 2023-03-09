import { Window } from './window';
import { Node } from '../scene/node';
import { SceneTree } from '../scene/scene_tree';
import { Time } from './time';
import { Renderer } from '../renderer/renderer';

type Config = {
    fps: number;
    scene: typeof Node | (typeof Node)[];
    parent: string;
    clearColor: string | number;
};

export class Application {
    private config: Config = { fps: 1 / 50, scene: [], parent: 'body', clearColor: 0x0000 };
    private window: Window;
    private sceneTree: SceneTree;
    private renderer: Renderer;

    private initialized = false;

    constructor(config: Partial<Config>) {
        this.config = { ...this.config, ...config };
        this.window = new Window(config.parent);
        this.renderer = new Renderer(this.window, { clearColor: this.config.clearColor });
        this.sceneTree = SceneTree.instance;
    }

    public init() {
        this.window.init();
        this.window.setResizeCallback(this.onWindowResize.bind(this));
        this.sceneTree.init(this.config.scene);

        this.initialized = true;
    }

    public run() {
        if (!this.initialized) this.init();

        Time.fixedDeltaTime = this.config.fps;
        Time.last = window.performance.now();
        window.requestAnimationFrame(this.update.bind(this));
    }

    private update() {
        Time.now = window.performance.now();
        Time.deltaTime = Math.min((Time.now - Time.last) / 1000, 0.25);
        Time.last = Time.now;

        Time.accumulator += Time.deltaTime;
        if (Time.accumulator >= Time.fixedDeltaTime) {
            this.sceneTree.fixedUpdate();
            Time.fixedTime += Time.fixedDeltaTime;
            Time.accumulator -= Time.fixedDeltaTime;
        }

        Time.alpha = Time.accumulator / Time.fixedDeltaTime;
        this.sceneTree.update();
        Time.time += Time.deltaTime;

        window.requestAnimationFrame(this.update.bind(this));
    }

    private onWindowResize(window: Window) {
        this.renderer.onWindowResize(window);
    }
}
