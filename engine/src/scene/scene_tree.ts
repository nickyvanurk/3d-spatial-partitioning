export class SceneTree {
    private static instance: SceneTree;
    public root: TreeNode = undefined;
    private currentScene: TreeNode;

    private constructor() {}

    public static getInstance() {
        if (!SceneTree.instance) {
            SceneTree.instance = new SceneTree();
            SceneTree.instance.root = new TreeNode('root');
        }
        return SceneTree.instance;
    }

    init(scenes: typeof TreeNode | (typeof TreeNode)[]) {
        if (!Array.isArray(scenes)) scenes = [scenes];
        const constructedScenes = scenes.map(Scene => new Scene());
        this.addScene(constructedScenes);
        this.setCurrentScene(constructedScenes[0]);
    }

    addScene(scenes: TreeNode | TreeNode[]) {
        if (!Array.isArray(scenes)) {
            scenes = [scenes];
        }

        for (const scene of scenes) {
            this.root.addChild(scene);
        }
    }

    setCurrentScene(scene: TreeNode) {
        if (scene && scene.getParent() !== this.root) throw new Error('Not a child node of root');
        this.currentScene = scene;
    }

    fixedUpdate(node = this.currentScene) {
        if (node) {
            node.fixedUpdate();
        }

        for (const child of node.children) {
            this.fixedUpdate(child);
        }
    }

    update(node = this.currentScene) {
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
    public tree = SceneTree.getInstance();
    public root = SceneTree.getInstance().root;

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
