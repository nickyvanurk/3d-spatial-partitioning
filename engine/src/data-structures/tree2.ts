export interface TreeNode<T> {
    data: T;
    parent: TreeNode<T>;
    children: TreeNode<T>[];
}

export class TreeNode<T> implements TreeNode<T> {
    constructor(
        public data: T = undefined,
        public parent: TreeNode<T> = undefined,
        public children: TreeNode<T>[] = [],
    ) {}
}

export class Tree<T> {
    constructor(public root: TreeNode<T> = new TreeNode<T>()) {}

    public add(data: T | TreeNode<T>, parent = this.root) {
        if (data instanceof TreeNode<T>) {
            parent.children.push(data);
            return data;
        }

        const node = new TreeNode(data, parent);
        parent.children.push(node);
        return node;
    }

    public find(data: T, parent = this.root) {
        if (parent.data === data) {
            return parent;
        }

        for (const child of parent.children) {
            const node: TreeNode<T> = this.find(data, child);
            if (node) return node;
        }

        return undefined;
    }

    public traverse(cb: (data: TreeNode<T>) => void, parent = this.root) {
        cb(parent);
        for (const child of parent.children) {
            this.traverse(cb, child);
        }
    }

    public delete(data: T, parent = this.root) {
        const node = this.find(data, parent);
        if (node) {
            node.parent.children.splice(node.parent.children.indexOf(node), 1);
        }
        return node as typeof node;
    }
}
