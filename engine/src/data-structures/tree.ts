export interface ITreeNode<T> {
    data: T;
    parent: ITreeNode<T>;
    children: Array<ITreeNode<T>>;
}

export interface ITree<T, P = ITreeNode<T>, R = P> {
    add(data: T, parent: P): R;
    find(data: T, parent: P): R | undefined;
    traverse(cb: (data: T | P | R) => void, parent: P): void;
    delete(data: T, parent: P): R;
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
    root: ITreeNode<T>;

    constructor(data: T) {
        this.root = new TreeNode(data);
    }

    add(data: T, parent = this.root) {
        const node = new TreeNode(data, parent);
        parent.children.push(node);
        return node;
    }

    find(data: T, parent = this.root): TreeNode<T> | undefined {
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
