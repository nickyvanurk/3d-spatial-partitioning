export interface ITreeNode<T> {
    data: T;
    parent: ITreeNode<T>;
    children: Array<ITreeNode<T>>;
}

export interface ITree<T, N = ITreeNode<T>> {
    add(data: T | N, parent: N, ctor: { new (data: T, parent: N): N }): N;
    find(data: T, parent: N): N | undefined;
    traverse(cb: (data: N) => void, parent: N): void;
    delete(data: T, parent: N): N;
}

export class TreeNode<T> implements ITreeNode<T> {
    data: T;
    parent: ITreeNode<T>;
    children: Array<ITreeNode<T>>;

    constructor(data?: T, parent?: ITreeNode<T>) {
        this.data = data || undefined;
        this.parent = parent || undefined;
        this.children = [];
    }
}

export class Tree<T> implements ITree<T> {
    public root: ITreeNode<T>;

    constructor(data: T, private ctor: { new (data?: T, parent?: ITreeNode<T>): ITreeNode<T> } = TreeNode) {
        this.root = new ctor(data);
    }

    add(data: T, parent = this.root) {
        const node = new this.ctor(data, parent);
        parent.children.push(node);
        return node;
    }

    find(data: T, parent = this.root): ITreeNode<T> | undefined {
        if (parent.data === data) {
            return parent;
        }

        for (const child of parent.children) {
            const node = this.find(data, child);
            if (node) return node;
        }

        return undefined;
    }

    traverse(cb: (data: ITreeNode<T>) => void, parent = this.root) {
        cb(parent);
        for (const child of parent.children) {
            this.traverse(cb, child);
        }
    }

    delete(data: T, parent = this.root) {
        const node = this.find(data, parent);
        if (node) {
            node.parent.children.splice(node.parent.children.indexOf(node), 1);
        }
        return node;
    }
}
