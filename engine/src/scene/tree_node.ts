import { SceneTree } from './scene_tree';

export class TreeNode {
    public name = 'Node';
    public parent: TreeNode = undefined;
    public children: TreeNode[] = [];
    public tree = SceneTree.instance;
    public root = SceneTree.instance.root;

    constructor(config?: string | Partial<TreeNode>) {
        typeof config === 'string' ? (this.name = config) : Object.assign(this, config);
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

    fixedUpdate() {}

    update() {}
}
