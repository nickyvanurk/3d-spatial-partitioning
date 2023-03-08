import { Scene } from './scene';
import { TreeNode } from './tree_node';

export class SceneTree {
    private static _instance: SceneTree;

    public static get instance() {
        if (!SceneTree._instance) {
            SceneTree._instance = new SceneTree();
            SceneTree._instance.root = new TreeNode('root');
        }
        return SceneTree._instance;
    }

    public root: TreeNode = undefined;
    private _currentScene: Scene;

    private constructor() {}

    init(scenes: typeof TreeNode | (typeof TreeNode)[]) {
        if (!Array.isArray(scenes)) scenes = [scenes];
        const constructedScenes = scenes.map(Scene => new Scene());
        this.addScene(constructedScenes);
        this.currentScene = constructedScenes[0] as Scene;
    }

    addScene(scenes: TreeNode | TreeNode[]) {
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

    fixedUpdate(node = this._currentScene as TreeNode) {
        if (node) {
            node.fixedUpdate();
        }

        for (const child of node.children) {
            this.fixedUpdate(child);
        }
    }

    update(node = this._currentScene as TreeNode) {
        if (node) {
            node.update();
        }

        for (const child of node.children) {
            this.update(child);
        }
    }
}
