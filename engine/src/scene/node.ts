import { SceneTree } from './scene_tree';

export class Node {
    public name = 'Node';
    public parent: Node = undefined;
    public children: Node[] = [];
    public tree = SceneTree.instance;
    public root = SceneTree.instance.root;

    constructor(config?: string | Partial<Node>) {
        typeof config === 'string' ? (this.name = config) : Object.assign(this, config);
    }

    addChild(node: Node) {
        node.parent = this;
        this.children.push(node);
        return node;
    }

    traverseChildren(cb: (node: Node) => void) {
        cb(this);
        for (const child of this.children) {
            child.traverseChildren(cb);
        }
    }

    fixedUpdate() {}

    update() {}
}
