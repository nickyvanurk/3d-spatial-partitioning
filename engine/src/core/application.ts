import { Scene } from '../scene/scene';
import { SceneManager } from '../scene/scene_manager';
import { Window } from './window';
import { Renderer } from '../renderer/renderer';
import { Time } from './time';

type Config = {
    scene: { new (): Scene } | { new (): Scene }[];
    parent?: string;
    backgroundColor?: string | number;
};

export class Application {
    private renderer: Renderer;
    private sceneManager: SceneManager;

    constructor(config: Config) {
        const w = new Window(config.parent || 'body');
        w.setResizeCallback(this.onWindowResize.bind(this));

        this.renderer = new Renderer(w, { clearColor: config.backgroundColor });

        this.sceneManager = new SceneManager(config.scene);

        Time.fixedDeltaTime = 1 / 50;
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
        this.renderer.onWindowResize(window);
        this.sceneManager.onWindowResize(window);
    }
}
