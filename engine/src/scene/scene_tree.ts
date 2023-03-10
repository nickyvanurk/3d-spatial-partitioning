import { Scene } from './scene';
import { Viewport } from './viewport';
import { Node } from './node';

export class SceneTree {
    root: Viewport;

    private static _instance: SceneTree;
    private _currentScene: Scene;

    public static get instance() {
        if (!SceneTree._instance) {
            SceneTree._instance = new SceneTree();
            SceneTree._instance.root = new Viewport('root');
        }
        return SceneTree._instance;
    }

    private constructor() {}

    init(scenes: typeof Node | (typeof Node)[]) {
        if (!Array.isArray(scenes)) scenes = [scenes];
        const constructedScenes = scenes.map(Scene => new Scene());
        this.addScene(constructedScenes);
        this.currentScene = constructedScenes[0] as Scene;
    }

    addScene(scenes: Node | Node[]) {
        if (!Array.isArray(scenes)) {
            scenes = [scenes];
        }

        for (const scene of scenes) {
            this.root.addChild(scene);
        }
    }

    public set currentScene(scene: Scene | string) {
        if (typeof scene === 'string') {
            const name = scene;
            scene = this.root.children.find(s => s.name === name) as Scene;
            if (!scene) throw new Error(`Scene ${name} not found`);
        }

        if (scene && scene.parent !== this.root) throw new Error('Not a child node of root');
        this._currentScene = scene;
        this._currentScene.onActiveCallback();
    }

    fixedUpdate(node = this._currentScene as Node) {
        if (node) {
            node.fixedUpdate();
        }

        for (const child of node.children) {
            this.fixedUpdate(child);
        }
    }

    update(node = this._currentScene as Node) {
        if (node) {
            node.update();
        }

        for (const child of node.children) {
            this.update(child);
        }
    }
}
