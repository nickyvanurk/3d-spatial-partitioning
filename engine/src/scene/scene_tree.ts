export class SceneTree {
    public root: TreeNode = new TreeNode();

    private currentScene: TreeNode = null;

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
    constructor(public name: string = '', public parent: TreeNode = undefined, public children: TreeNode[] = []) {}

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
