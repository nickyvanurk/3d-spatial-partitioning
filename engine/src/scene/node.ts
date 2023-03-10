import { SceneTree } from './scene_tree';
import { Viewport } from './viewport';

export class Node {
    public name = 'Node';
    public parent: Node = undefined;
    public children: Node[] = [];
    public tree = SceneTree.instance;
    public root = SceneTree.instance.root;

    viewport: Viewport = undefined;

    constructor(config?: string | Partial<Node>) {
        typeof config === 'string' ? (this.name = config) : Object.assign(this, config);
        if (this instanceof Viewport) this.viewport = this;
    }

    init() {}

    addChild(node: Node) {
        node.parent = this;
        node.viewport = this.viewport;
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
