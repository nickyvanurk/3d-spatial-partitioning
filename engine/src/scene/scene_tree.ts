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
    private _currentScene: TreeNode;

    private constructor() {}

    init(scenes: typeof TreeNode | (typeof TreeNode)[]) {
        if (!Array.isArray(scenes)) scenes = [scenes];
        const constructedScenes = scenes.map(Scene => new Scene());
        this.addScene(constructedScenes);
        this.currentScene = constructedScenes[0];
    }

    addScene(scenes: TreeNode | TreeNode[]) {
        if (!Array.isArray(scenes)) {
            scenes = [scenes];
        }

        for (const scene of scenes) {
            this.root.addChild(scene);
        }
    }

    public set currentScene(scene: TreeNode) {
        if (scene && scene.getParent() !== this.root) throw new Error('Not a child node of root');
        this._currentScene = scene;
    }

    fixedUpdate(node = this._currentScene) {
        if (node) {
            node.fixedUpdate();
        }

        for (const child of node.children) {
            this.fixedUpdate(child);
        }
    }

    update(node = this._currentScene) {
        if (node) {
            node.update();
        }

        for (const child of node.children) {
            this.update(child);
        }
    }
}

export class TreeNode {
    public name = 'Node';
    public parent: TreeNode = undefined;
    public children: TreeNode[] = [];
    public tree = SceneTree.instance;
    public root = SceneTree.instance.root;

    constructor(config?: string | Partial<TreeNode>) {
        typeof config === 'string' ? (this.name = config) : Object.assign(this, config);
    }

    getParent() {
        return this.parent;
    }

    addChild(node: TreeNode) {
        node.parent = this;
        this.children.push(node);
        return node;
    }

    traverseChildren(cb: (node: TreeNode) => void) {
        cb(this);
        for (const child of this.children) {
            child.traverseChildren(cb);
        }
    }

    fixedUpdate() {
        // do nothing
    }

    update() {
        // do nothing
    }
}
